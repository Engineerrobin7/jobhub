// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  skills: string[];
  experience: string;
  education: string;
  resume?: string;
  preferences: JobPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobPreferences {
  remote: boolean;
  locations: string[];
  jobTypes: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  industries: string[];
}

// Job Types
export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  remote: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  applyUrl: string;
  sourceUrl: string;
  source: string;
  postedDate: Date;
  expiresDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobFilters {
  search?: string;
  location?: string;
  remote?: boolean;
  type?: string[];
  company?: string[];
  salaryMin?: number;
  salaryMax?: number;
  tags?: string[];
  postedAfter?: Date;
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'salary' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

// Bookmark Types
export interface Bookmark {
  id: string;
  userId: string;
  jobId: string;
  createdAt: Date;
}

// Company Types
export interface Company {
  id: string;
  name: string;
  logo?: string;
  website: string;
  careerPage: string;
  description?: string;
  industry: string;
  size: string;
  location: string;
  isActive: boolean;
  lastScraped?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Scraping Types
export interface ScrapingSource {
  id: string;
  companyId: string;
  url: string;
  selectors: {
    jobList: string;
    jobTitle: string;
    jobLink: string;
    companyName: string;
    location: string;
    description: string;
    salary?: string;
    postedDate?: string;
  };
  isActive: boolean;
  lastScraped?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  salary?: string;
  postedDate?: string;
  tags?: string[];
}

// AI Analysis Types
export interface ResumeAnalysis {
  id: string;
  userId: string;
  jobId: string;
  score: number;
  suggestions: string[];
  matchedSkills: string[];
  missingSkills: string[];
  createdAt: Date;
}

export interface CultureMatch {
  id: string;
  userId: string;
  companyId: string;
  score: number;
  factors: {
    workStyle: number;
    values: number;
    communication: number;
    growth: number;
  };
  createdAt: Date;
}

export interface SuccessPrediction {
  id: string;
  userId: string;
  jobId: string;
  probability: number;
  factors: {
    skillMatch: number;
    experience: number;
    culture: number;
    market: number;
  };
  recommendations: string[];
  createdAt: Date;
}

// Analytics Types
export interface UserAnalytics {
  userId: string;
  applicationsSubmitted: number;
  jobsBookmarked: number;
  jobsViewed: number;
  topCompanies: string[];
  topSkills: string[];
  averageSalary: number;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Database Types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

// Scraping Configuration
export interface ScrapingConfig {
  delay: number;
  timeout: number;
  userAgent: string;
  maxRetries: number;
  concurrent: number;
}

// Rate Limiting
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

// Email Types
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Logging Types
export interface LogConfig {
  level: string;
  file: string;
  maxSize: string;
  maxFiles: number;
}

// Environment Variables
export interface Environment {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  SCRAPER_DELAY: number;
  SCRAPER_TIMEOUT: number;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: string;
  LOG_FILE: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  OPENAI_API_KEY?: string;
  AI_ENABLED: boolean;
}
