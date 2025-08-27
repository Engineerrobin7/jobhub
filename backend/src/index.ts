import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env, apiConfig, rateLimitConfig } from '@/config';
import { errorHandler, notFoundHandler } from '@/utils/errors';
import { logger } from '@/utils/logger';

// Import routes
import authRoutes from '@/routes/auth';
import jobRoutes from '@/routes/jobs';
import bookmarkRoutes from '@/routes/bookmarks';
import userRoutes from '@/routes/users';
import adminRoutes from '@/routes/admin';

// Import services
import { initializeDatabase } from '@/database/connection';
import { initializeRedis } from '@/utils/redis';
import { startScrapingScheduler } from '@/services/scraper';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: apiConfig.cors.origin,
  credentials: apiConfig.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.maxRequests,
  message: {
    success: false,
    error: rateLimitConfig.message,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JobHub API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// API routes
app.use(`${apiConfig.prefix}/auth`, authRoutes);
app.use(`${apiConfig.prefix}/jobs`, jobRoutes);
app.use(`${apiConfig.prefix}/bookmarks`, bookmarkRoutes);
app.use(`${apiConfig.prefix}/users`, userRoutes);
app.use(`${apiConfig.prefix}/admin`, adminRoutes);

// API documentation endpoint
app.get(`${apiConfig.prefix}/docs`, (req, res) => {
  res.json({
    success: true,
    message: 'JobHub API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /auth/register': 'Register a new user',
        'POST /auth/login': 'Login user',
        'POST /auth/logout': 'Logout user',
        'GET /auth/me': 'Get current user',
        'POST /auth/refresh': 'Refresh access token',
      },
      jobs: {
        'GET /jobs': 'Get jobs with filters and pagination',
        'GET /jobs/:id': 'Get job details',
        'GET /jobs/:id/similar': 'Get similar jobs',
        'GET /jobs/stats': 'Get job statistics',
      },
      bookmarks: {
        'GET /bookmarks': 'Get user bookmarks',
        'POST /bookmarks/:jobId': 'Add job to bookmarks',
        'DELETE /bookmarks/:jobId': 'Remove job from bookmarks',
      },
      users: {
        'GET /users/profile': 'Get user profile',
        'PUT /users/profile': 'Update user profile',
        'PUT /users/password': 'Change password',
        'GET /users/analytics': 'Get user analytics',
      },
      admin: {
        'GET /admin/stats': 'Get platform statistics',
        'GET /admin/jobs': 'Get all jobs (admin)',
        'PUT /admin/jobs/:id': 'Update job (admin)',
        'DELETE /admin/jobs/:id': 'Delete job (admin)',
        'GET /admin/scraping-sources': 'Get scraping sources',
        'POST /admin/scraping-sources': 'Add scraping source',
        'PUT /admin/scraping-sources/:id': 'Update scraping source',
        'DELETE /admin/scraping-sources/:id': 'Delete scraping source',
      },
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Initialize and start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database connected successfully');

    // Initialize Redis
    await initializeRedis();
    logger.info('Redis connected successfully');

    // Start scraping scheduler
    if (env.NODE_ENV === 'production') {
      startScrapingScheduler();
      logger.info('Scraping scheduler started');
    }

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 JobHub API server running on port ${env.PORT}`);
      logger.info(`📊 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 API URL: http://localhost:${env.PORT}${apiConfig.prefix}`);
      logger.info(`📚 API Docs: http://localhost:${env.PORT}${apiConfig.prefix}/docs`);
      logger.info(`❤️  Health Check: http://localhost:${env.PORT}/health`);
    });

    // Graceful shutdown for server
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, closing server');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
