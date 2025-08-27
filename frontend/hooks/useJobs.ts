import { useState, useEffect, useCallback } from 'react';
import { Job, JobFilters, PaginatedResponse } from '@/types';
import { apiService } from '@/services/api';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchJobs = useCallback(async (newFilters?: JobFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = { ...filters, ...newFilters };
      const response: PaginatedResponse<Job> = await apiService.getJobs(currentFilters);
      
      setJobs(response.items);
      setPagination(response.pagination);
      setFilters(currentFilters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadMoreJobs = useCallback(async () => {
    if (pagination.page >= pagination.totalPages) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const nextPage = pagination.page + 1;
      const offset = (nextPage - 1) * pagination.limit;
      const response: PaginatedResponse<Job> = await apiService.getJobs({
        ...filters,
        offset,
        limit: pagination.limit,
      });
      
      setJobs(prev => [...prev, ...response.items]);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more jobs');
      console.error('Error loading more jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, pagination.totalPages]);

  const applyFilters = useCallback((newFilters: JobFilters) => {
    setFilters(newFilters);
    fetchJobs(newFilters);
  }, [fetchJobs]);

  const searchJobs = useCallback((searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm, offset: 0 };
    setFilters(newFilters);
    fetchJobs(newFilters);
  }, [filters, fetchJobs]);

  const getJobById = useCallback(async (id: string): Promise<Job | null> => {
    try {
      const job = await apiService.getJobById(id);
      return job;
    } catch (err) {
      console.error('Error fetching job:', err);
      return null;
    }
  }, []);

  const getSimilarJobs = useCallback(async (id: string, limit: number = 5): Promise<Job[]> => {
    try {
      const similarJobs = await apiService.getSimilarJobs(id, limit);
      return similarJobs;
    } catch (err) {
      console.error('Error fetching similar jobs:', err);
      return [];
    }
  }, []);

  const getJobStats = useCallback(async () => {
    try {
      const stats = await apiService.getJobStats();
      return stats;
    } catch (err) {
      console.error('Error fetching job stats:', err);
      return null;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    filters,
    pagination,
    fetchJobs,
    loadMoreJobs,
    applyFilters,
    searchJobs,
    getJobById,
    getSimilarJobs,
    getJobStats,
  };
};

export default useJobs;
