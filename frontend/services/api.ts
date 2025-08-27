import { ApiResponse, Job, JobFilters, PaginatedResponse, User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Mock data for development
let mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    remote: true,
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    description: 'We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences.',
    requirements: ['React', 'TypeScript', '5+ years experience', 'Team leadership'],
    benefits: ['Health insurance', '401k', 'Remote work', 'Flexible hours'],
    tags: ['React', 'TypeScript', 'Frontend', 'Senior'],
    postedDate: '2024-01-15T10:00:00Z',
    deadline: '2024-02-15T10:00:00Z',
    applications: 45,
    status: 'active',
    employer: {
      id: '1',
      name: 'TechCorp Inc.',
      logo: '/api/placeholder/60/60',
      description: 'Leading technology company'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'full-time',
    remote: false,
    salary: {
      min: 100000,
      max: 150000,
      currency: 'USD'
    },
    description: 'Join our fast-growing startup as a Product Manager and help shape the future of our products.',
    requirements: ['Product management', 'Agile methodology', '3+ years experience'],
    benefits: ['Equity', 'Health insurance', 'Flexible PTO'],
    tags: ['Product Management', 'Agile', 'Startup'],
    postedDate: '2024-01-14T10:00:00Z',
    deadline: '2024-02-14T10:00:00Z',
    applications: 32,
    status: 'active',
    employer: {
      id: '2',
      name: 'StartupXYZ',
      logo: '/api/placeholder/60/60',
      description: 'Innovative startup'
    },
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Design Studio Pro',
    location: 'Los Angeles, CA',
    type: 'contract',
    remote: true,
    salary: {
      min: 80000,
      max: 120000,
      currency: 'USD'
    },
    description: 'Creative UX/UI Designer needed for exciting design projects.',
    requirements: ['Figma', 'Adobe Creative Suite', 'Portfolio', '2+ years experience'],
    benefits: ['Flexible hours', 'Remote work', 'Creative freedom'],
    tags: ['UX/UI', 'Design', 'Figma', 'Creative'],
    postedDate: '2024-01-13T10:00:00Z',
    deadline: '2024-02-13T10:00:00Z',
    applications: 28,
    status: 'active',
    employer: {
      id: '3',
      name: 'Design Studio Pro',
      logo: '/api/placeholder/60/60',
      description: 'Creative design agency'
    },
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z'
  },
  {
    id: '4',
    title: 'Backend Engineer',
    company: 'DataFlow Systems',
    location: 'Austin, TX',
    type: 'full-time',
    remote: true,
    salary: {
      min: 110000,
      max: 160000,
      currency: 'USD'
    },
    description: 'Backend Engineer to build scalable systems and APIs.',
    requirements: ['Node.js', 'Python', 'Database design', '4+ years experience'],
    benefits: ['Health insurance', '401k', 'Remote work', 'Learning budget'],
    tags: ['Backend', 'Node.js', 'Python', 'API'],
    postedDate: '2024-01-12T10:00:00Z',
    deadline: '2024-02-12T10:00:00Z',
    applications: 38,
    status: 'active',
    employer: {
      id: '4',
      name: 'DataFlow Systems',
      logo: '/api/placeholder/60/60',
      description: 'Data infrastructure company'
    },
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Seattle, WA',
    type: 'full-time',
    remote: true,
    salary: {
      min: 130000,
      max: 190000,
      currency: 'USD'
    },
    description: 'DevOps Engineer to manage our cloud infrastructure and deployment pipelines.',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', '5+ years experience'],
    benefits: ['Health insurance', '401k', 'Remote work', 'Certification support'],
    tags: ['DevOps', 'AWS', 'Docker', 'Kubernetes'],
    postedDate: '2024-01-11T10:00:00Z',
    deadline: '2024-02-11T10:00:00Z',
    applications: 25,
    status: 'active',
    employer: {
      id: '5',
      name: 'CloudTech Solutions',
      logo: '/api/placeholder/60/60',
      description: 'Cloud technology company'
    },
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-11T10:00:00Z'
  }
];

export class ApiService {
  private baseURL: string;
  private useMockData: boolean;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.useMockData = !process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === 'development';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('jobhub_token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: credentials.email,
        role: 'jobseeker',
        avatar: '/api/placeholder/100/100',
        bio: 'Experienced software developer',
        location: 'San Francisco, CA',
        skills: ['React', 'TypeScript', 'Node.js'],
        experience: 5,
        education: 'Bachelor in Computer Science',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      return {
        user: mockUser,
        token: 'mock_jwt_token',
        refreshToken: 'mock_refresh_token'
      };
    }

    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: '/api/placeholder/100/100',
        bio: '',
        location: '',
        skills: [],
        experience: 0,
        education: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      return {
        user: mockUser,
        token: 'mock_jwt_token',
        refreshToken: 'mock_refresh_token'
      };
    }

    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data!;
  }

  async logout(): Promise<void> {
    if (this.useMockData) {
      return;
    }

    await this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<User> {
    if (this.useMockData) {
      const userData = localStorage.getItem('jobhub_user');
      if (userData) {
        return JSON.parse(userData);
      }
      throw new Error('User not found');
    }

    const response = await this.request<User>('/auth/me');
    return response.data!;
  }

  async refreshToken(): Promise<AuthResponse> {
    if (this.useMockData) {
      throw new Error('Mock refresh not implemented');
    }

    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
    return response.data!;
  }

  // Job endpoints
  async getJobs(filters: JobFilters = {}): Promise<PaginatedResponse<Job>> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredJobs = [...mockJobs];
      
      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.location) {
        const locationTerm = filters.location.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(locationTerm)
        );
      }
      
      if (filters.type && filters.type.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          filters.type!.includes(job.type)
        );
      }
      
      // Pagination
      const page = filters.offset ? Math.floor(filters.offset / (filters.limit || 20)) + 1 : 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
      
      return {
        items: paginatedJobs,
        pagination: {
          page,
          limit,
          total: filteredJobs.length,
          totalPages: Math.ceil(filteredJobs.length / limit)
        }
      };
    }

    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.remote !== undefined) params.append('remote', filters.remote.toString());
    if (filters.type) params.append('type', filters.type.join(','));
    if (filters.company) params.append('company', filters.company.join(','));
    if (filters.salaryMin) params.append('salaryMin', filters.salaryMin.toString());
    if (filters.salaryMax) params.append('salaryMax', filters.salaryMax.toString());
    if (filters.tags) params.append('tags', filters.tags.join(','));
    if (filters.postedAfter) params.append('postedAfter', filters.postedAfter.toISOString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await this.request<PaginatedResponse<Job>>(`/jobs?${params.toString()}`);
    return response.data!;
  }

  async getJobById(id: string): Promise<Job> {
    if (this.useMockData) {
      const job = mockJobs.find(j => j.id === id);
      if (!job) {
        throw new Error('Job not found');
      }
      return job;
    }

    const response = await this.request<Job>(`/jobs/${id}`);
    return response.data!;
  }

  async getSimilarJobs(id: string, limit: number = 5): Promise<Job[]> {
    if (this.useMockData) {
      const currentJob = mockJobs.find(j => j.id === id);
      if (!currentJob) {
        return [];
      }
      
      // Find jobs with similar tags
      const similarJobs = mockJobs
        .filter(job => job.id !== id && job.tags.some(tag => currentJob.tags.includes(tag)))
        .slice(0, limit);
      
      return similarJobs;
    }

    const response = await this.request<Job[]>(`/jobs/${id}/similar?limit=${limit}`);
    return response.data!;
  }

  async getJobStats(): Promise<any> {
    if (this.useMockData) {
      return {
        totalJobs: mockJobs.length,
        activeJobs: mockJobs.filter(j => j.status === 'active').length,
        totalApplications: mockJobs.reduce((sum, job) => sum + job.applications, 0),
        averageSalary: mockJobs.reduce((sum, job) => sum + (job.salary?.min || 0), 0) / mockJobs.length
      };
    }

    const response = await this.request<any>('/jobs/stats');
    return response.data!;
  }

  // Application endpoints
  async applyToJob(jobId: string, applicationData: any): Promise<any> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, applicationId: `app_${Date.now()}` };
    }

    const response = await this.request<any>(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
    return response.data!;
  }

  async getUserApplications(): Promise<any[]> {
    if (this.useMockData) {
      return [
        {
          id: '1',
          jobId: '1',
          job: mockJobs[0],
          status: 'pending',
          appliedAt: '2024-01-10T10:00:00Z'
        },
        {
          id: '2',
          jobId: '2',
          job: mockJobs[1],
          status: 'reviewed',
          appliedAt: '2024-01-08T10:00:00Z'
        }
      ];
    }

    const response = await this.request<any[]>('/applications');
    return response.data!;
  }

  // Profile endpoints
  async updateProfile(profileData: any): Promise<any> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage
      const currentUser = localStorage.getItem('jobhub_user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('jobhub_user', JSON.stringify(updatedUser));
      }
      
      return { success: true };
    }

    const response = await this.request<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data!;
  }

  async getProfile(): Promise<any> {
    if (this.useMockData) {
      const userData = localStorage.getItem('jobhub_user');
      if (userData) {
        return JSON.parse(userData);
      }
      throw new Error('Profile not found');
    }

    const response = await this.request<any>('/profile');
    return response.data!;
  }

  // Bookmark endpoints
  async getBookmarks(): Promise<Job[]> {
    if (this.useMockData) {
      return mockJobs.filter(job => job.id === '1' || job.id === '2'); // Mock bookmarks for user 1 and 2
    }

    const response = await this.request<Job[]>('/bookmarks');
    return response.data!;
  }

  async addBookmark(jobId: string): Promise<void> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    await this.request(`/bookmarks/${jobId}`, {
      method: 'POST',
    });
  }

  async removeBookmark(jobId: string): Promise<void> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    await this.request(`/bookmarks/${jobId}`, {
      method: 'DELETE',
    });
  }

  // User profile endpoints
  async getUserProfile(): Promise<any> {
    if (this.useMockData) {
      const userData = localStorage.getItem('jobhub_user');
      if (userData) {
        return JSON.parse(userData);
      }
      throw new Error('Profile not found');
    }

    const response = await this.request<any>('/users/profile');
    return response.data!;
  }

  async updateUserProfile(profileData: any): Promise<any> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage
      const currentUser = localStorage.getItem('jobhub_user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('jobhub_user', JSON.stringify(updatedUser));
      }
      
      return { success: true };
    }

    const response = await this.request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data!;
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    await this.request('/users/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getUserAnalytics(): Promise<any> {
    if (this.useMockData) {
      return {
        totalJobsApplied: 10,
        totalApplications: 15,
        totalJobsSaved: 5,
        totalBookmarks: 3
      };
    }

    const response = await this.request<any>('/users/analytics');
    return response.data!;
  }

  // Admin endpoints (if user is admin)
  async getAdminStats(): Promise<any> {
    if (this.useMockData) {
      return {
        totalJobs: mockJobs.length,
        totalApplications: mockJobs.reduce((sum, job) => sum + job.applications, 0),
        totalUsers: 10,
        totalBookmarks: 10
      };
    }

    const response = await this.request<any>('/admin/stats');
    return response.data!;
  }

  async getAllJobs(filters: JobFilters = {}): Promise<PaginatedResponse<Job>> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredJobs = [...mockJobs];
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.location) {
        const locationTerm = filters.location.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(locationTerm)
        );
      }
      
      if (filters.type && filters.type.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          filters.type!.includes(job.type)
        );
      }
      
      const page = filters.offset ? Math.floor(filters.offset / (filters.limit || 20)) + 1 : 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
      
      return {
        items: paginatedJobs,
        pagination: {
          page,
          limit,
          total: filteredJobs.length,
          totalPages: Math.ceil(filteredJobs.length / limit)
        }
      };
    }

    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.remote !== undefined) params.append('remote', filters.remote.toString());
    if (filters.type) params.append('type', filters.type.join(','));
    if (filters.company) params.append('company', filters.company.join(','));
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const response = await this.request<PaginatedResponse<Job>>(`/admin/jobs?${params.toString()}`);
    return response.data!;
  }

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = mockJobs.findIndex(j => j.id === id);
      if (index === -1) {
        throw new Error('Job not found');
      }
      const updatedJob = { ...mockJobs[index], ...jobData };
      mockJobs[index] = updatedJob;
      
      return updatedJob;
    }

    const response = await this.request<Job>(`/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
    return response.data!;
  }

  async deleteJob(id: string): Promise<void> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const initialLength = mockJobs.length;
      mockJobs = mockJobs.filter(j => j.id !== id);
      if (mockJobs.length === initialLength) {
        throw new Error('Job not found');
      }
      return;
    }

    await this.request(`/admin/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<any> {
    if (this.useMockData) {
      return { status: 'ok', message: 'Mock API is running' };
    }

    const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
