// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'jobseeker' | 'employer';
  avatar?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'jobseeker' | 'employer';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Job types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
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
  postedDate: string;
  deadline?: string;
  applications: number;
  status: 'active' | 'closed' | 'draft';
  employer: {
    id: string;
    name: string;
    logo?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Application types
export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  coverLetter?: string;
  resume?: string;
  appliedAt: string;
  updatedAt: string;
  job: Job;
  user: User;
}

// Profile types
export interface Profile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  socialLinks: SocialLinks;
  resume?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
}

export interface Language {
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

// Dashboard types
export interface DashboardStats {
  totalApplications: number;
  interviews: number;
  pending: number;
  successRate: number;
  recentApplications: JobApplication[];
  jobRecommendations: Job[];
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'application' | 'interview' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}
