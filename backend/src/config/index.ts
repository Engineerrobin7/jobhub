import dotenv from 'dotenv';
import { Environment, DatabaseConfig, RedisConfig, ScrapingConfig, RateLimitConfig, EmailConfig, LogConfig } from '@/types';

// Load environment variables
dotenv.config();

// Environment configuration
export const env: Environment = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/jobhub_db',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  SCRAPER_DELAY: parseInt(process.env.SCRAPER_DELAY || '2000', 10),
  SCRAPER_TIMEOUT: parseInt(process.env.SCRAPER_TIMEOUT || '30000', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'logs/app.log',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AI_ENABLED: process.env.AI_ENABLED === 'true',
};

// Database configuration
export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'jobhub_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
};

// Redis configuration
export const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
};

// Scraping configuration
export const scrapingConfig: ScrapingConfig = {
  delay: env.SCRAPER_DELAY,
  timeout: env.SCRAPER_TIMEOUT,
  userAgent: process.env.SCRAPER_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  maxRetries: 3,
  concurrent: 5,
};

// Rate limiting configuration
export const rateLimitConfig: RateLimitConfig = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
};

// Email configuration
export const emailConfig: EmailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
};

// Logging configuration
export const logConfig: LogConfig = {
  level: env.LOG_LEVEL,
  file: env.LOG_FILE,
  maxSize: '20m',
  maxFiles: 14,
};

// API configuration
export const apiConfig = {
  version: 'v1',
  prefix: '/api/v1',
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
};

// JWT configuration
export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-here',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

// Pagination configuration
export const paginationConfig = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultPage: 1,
};

// Cache configuration
export const cacheConfig = {
  ttl: 3600, // 1 hour
  checkPeriod: 600, // 10 minutes
  maxKeys: 1000,
};

// Validation configuration
export const validationConfig = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  email: {
    maxLength: 254,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
};

// Scraping sources configuration (example companies)
export const defaultScrapingSources = [
  {
    name: 'Google',
    website: 'https://careers.google.com',
    careerPage: 'https://careers.google.com/jobs/results/',
    selectors: {
      jobList: '.job-listing',
      jobTitle: '.job-title',
      jobLink: '.job-link',
      companyName: '.company-name',
      location: '.location',
      description: '.description',
      salary: '.salary',
      postedDate: '.posted-date',
    },
  },
  {
    name: 'Microsoft',
    website: 'https://careers.microsoft.com',
    careerPage: 'https://careers.microsoft.com/us/en/search-results',
    selectors: {
      jobList: '.job-card',
      jobTitle: '.job-title',
      jobLink: '.job-link',
      companyName: '.company-name',
      location: '.location',
      description: '.description',
      salary: '.salary',
      postedDate: '.posted-date',
    },
  },
  {
    name: 'Apple',
    website: 'https://jobs.apple.com',
    careerPage: 'https://jobs.apple.com/en-us/search',
    selectors: {
      jobList: '.job-item',
      jobTitle: '.job-title',
      jobLink: '.job-link',
      companyName: '.company-name',
      location: '.location',
      description: '.description',
      salary: '.salary',
      postedDate: '.posted-date',
    },
  },
];

// AI configuration
export const aiConfig = {
  enabled: env.AI_ENABLED,
  openaiApiKey: env.OPENAI_API_KEY,
  models: {
    gpt4: 'gpt-4',
    gpt35: 'gpt-3.5-turbo',
  },
  maxTokens: 2000,
  temperature: 0.7,
};

// Security configuration
export const securityConfig = {
  bcryptRounds: 12,
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};

// File upload configuration
export const uploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['pdf', 'doc', 'docx'],
  uploadDir: 'uploads',
};

export default {
  env,
  databaseConfig,
  redisConfig,
  scrapingConfig,
  rateLimitConfig,
  emailConfig,
  logConfig,
  apiConfig,
  jwtConfig,
  paginationConfig,
  cacheConfig,
  validationConfig,
  defaultScrapingSources,
  aiConfig,
  securityConfig,
  uploadConfig,
};
