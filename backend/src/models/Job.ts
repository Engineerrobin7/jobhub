import { Pool } from 'pg';
import { Job, JobFilters, PaginatedResponse } from '@/types';
import { databaseConfig, paginationConfig } from '@/config';
import { AppError } from '@/utils/errors';

export class JobModel {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(databaseConfig);
  }

  async createTable(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS companies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          logo VARCHAR(255),
          website VARCHAR(255) NOT NULL,
          career_page VARCHAR(255) NOT NULL,
          description TEXT,
          industry VARCHAR(100),
          size VARCHAR(50),
          location VARCHAR(100),
          is_active BOOLEAN DEFAULT true,
          last_scraped TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          company VARCHAR(100) NOT NULL,
          company_logo VARCHAR(255),
          location VARCHAR(100) NOT NULL,
          type VARCHAR(20) NOT NULL CHECK (type IN ('full-time', 'part-time', 'contract', 'internship', 'freelance')),
          remote BOOLEAN DEFAULT false,
          salary_min INTEGER,
          salary_max INTEGER,
          salary_currency VARCHAR(3) DEFAULT 'USD',
          description TEXT NOT NULL,
          requirements TEXT[] DEFAULT '{}',
          benefits TEXT[] DEFAULT '{}',
          tags TEXT[] DEFAULT '{}',
          apply_url VARCHAR(500) NOT NULL,
          source_url VARCHAR(500) NOT NULL,
          source VARCHAR(100) NOT NULL,
          posted_date TIMESTAMP NOT NULL,
          expires_date TIMESTAMP,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
        CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
        CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
        CREATE INDEX IF NOT EXISTS idx_jobs_remote ON jobs(remote);
        CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date);
        CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
        CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source);
        CREATE INDEX IF NOT EXISTS idx_jobs_title_fts ON jobs USING gin(to_tsvector('english', title));
        CREATE INDEX IF NOT EXISTS idx_jobs_description_fts ON jobs USING gin(to_tsvector('english', description));
        CREATE INDEX IF NOT EXISTS idx_jobs_tags ON jobs USING gin(tags);
        CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
        CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
        CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active);
      `);
    } finally {
      client.release();
    }
  }

  async create(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    const result = await this.pool.query(
      `INSERT INTO jobs (
        title, company, company_logo, location, type, remote, 
        salary_min, salary_max, salary_currency, description, 
        requirements, benefits, tags, apply_url, source_url, 
        source, posted_date, expires_date, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        jobData.title,
        jobData.company,
        jobData.companyLogo,
        jobData.location,
        jobData.type,
        jobData.remote,
        jobData.salary?.min,
        jobData.salary?.max,
        jobData.salary?.currency || 'USD',
        jobData.description,
        jobData.requirements,
        jobData.benefits,
        jobData.tags,
        jobData.applyUrl,
        jobData.sourceUrl,
        jobData.source,
        jobData.postedDate,
        jobData.expiresDate,
        jobData.isActive,
      ]
    );

    const job = result.rows[0];
    return this.mapRowToJob(job);
  }

  async findById(id: string): Promise<Job | null> {
    const result = await this.pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;
    
    return this.mapRowToJob(result.rows[0]);
  }

  async findWithFilters(filters: JobFilters): Promise<PaginatedResponse<Job>> {
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Base condition for active jobs
    conditions.push('is_active = true');

    // Search filter
    if (filters.search) {
      conditions.push(`(
        to_tsvector('english', title) @@ plainto_tsquery('english', $${paramCount}) OR
        to_tsvector('english', description) @@ plainto_tsquery('english', $${paramCount}) OR
        title ILIKE $${paramCount + 1} OR
        company ILIKE $${paramCount + 1}
      )`);
      values.push(filters.search);
      values.push(`%${filters.search}%`);
      paramCount += 2;
    }

    // Location filter
    if (filters.location) {
      conditions.push(`location ILIKE $${paramCount}`);
      values.push(`%${filters.location}%`);
      paramCount++;
    }

    // Remote filter
    if (filters.remote !== undefined) {
      conditions.push(`remote = $${paramCount}`);
      values.push(filters.remote);
      paramCount++;
    }

    // Job type filter
    if (filters.type && filters.type.length > 0) {
      conditions.push(`type = ANY($${paramCount})`);
      values.push(filters.type);
      paramCount++;
    }

    // Company filter
    if (filters.company && filters.company.length > 0) {
      conditions.push(`company = ANY($${paramCount})`);
      values.push(filters.company);
      paramCount++;
    }

    // Salary filters
    if (filters.salaryMin) {
      conditions.push(`salary_max >= $${paramCount}`);
      values.push(filters.salaryMin);
      paramCount++;
    }

    if (filters.salaryMax) {
      conditions.push(`salary_min <= $${paramCount}`);
      values.push(filters.salaryMax);
      paramCount++;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      conditions.push(`tags && $${paramCount}`);
      values.push(filters.tags);
      paramCount++;
    }

    // Posted after filter
    if (filters.postedAfter) {
      conditions.push(`posted_date >= $${paramCount}`);
      values.push(filters.postedAfter);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    let orderBy = 'ORDER BY posted_date DESC';
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'salary':
          orderBy = 'ORDER BY COALESCE(salary_max, 0) DESC';
          break;
        case 'relevance':
          if (filters.search) {
            orderBy = `ORDER BY ts_rank(to_tsvector('english', title), plainto_tsquery('english', '${filters.search}')) DESC`;
          }
          break;
        default:
          orderBy = 'ORDER BY posted_date DESC';
      }
    }

    if (filters.sortOrder === 'asc') {
      orderBy = orderBy.replace('DESC', 'ASC');
    }

    // Get total count
    const countResult = await this.pool.query(
      `SELECT COUNT(*) FROM jobs ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Pagination
    const limit = Math.min(filters.limit || paginationConfig.defaultLimit, paginationConfig.maxLimit);
    const offset = (filters.offset || 0);

    // Get jobs
    const jobsResult = await this.pool.query(
      `SELECT * FROM jobs ${whereClause} ${orderBy} LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...values, limit, offset]
    );

    const jobs = jobsResult.rows.map(row => this.mapRowToJob(row));

    return {
      items: jobs,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, updates: Partial<Job>): Promise<Job> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.title) {
      fields.push(`title = $${paramCount++}`);
      values.push(updates.title);
    }

    if (updates.company) {
      fields.push(`company = $${paramCount++}`);
      values.push(updates.company);
    }

    if (updates.companyLogo !== undefined) {
      fields.push(`company_logo = $${paramCount++}`);
      values.push(updates.companyLogo);
    }

    if (updates.location) {
      fields.push(`location = $${paramCount++}`);
      values.push(updates.location);
    }

    if (updates.type) {
      fields.push(`type = $${paramCount++}`);
      values.push(updates.type);
    }

    if (updates.remote !== undefined) {
      fields.push(`remote = $${paramCount++}`);
      values.push(updates.remote);
    }

    if (updates.salary) {
      fields.push(`salary_min = $${paramCount++}`);
      values.push(updates.salary.min);
      fields.push(`salary_max = $${paramCount++}`);
      values.push(updates.salary.max);
      fields.push(`salary_currency = $${paramCount++}`);
      values.push(updates.salary.currency);
    }

    if (updates.description) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }

    if (updates.requirements) {
      fields.push(`requirements = $${paramCount++}`);
      values.push(updates.requirements);
    }

    if (updates.benefits) {
      fields.push(`benefits = $${paramCount++}`);
      values.push(updates.benefits);
    }

    if (updates.tags) {
      fields.push(`tags = $${paramCount++}`);
      values.push(updates.tags);
    }

    if (updates.applyUrl) {
      fields.push(`apply_url = $${paramCount++}`);
      values.push(updates.applyUrl);
    }

    if (updates.sourceUrl) {
      fields.push(`source_url = $${paramCount++}`);
      values.push(updates.sourceUrl);
    }

    if (updates.source) {
      fields.push(`source = $${paramCount++}`);
      values.push(updates.source);
    }

    if (updates.postedDate) {
      fields.push(`posted_date = $${paramCount++}`);
      values.push(updates.postedDate);
    }

    if (updates.expiresDate !== undefined) {
      fields.push(`expires_date = $${paramCount++}`);
      values.push(updates.expiresDate);
    }

    if (updates.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(updates.isActive);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.pool.query(
      `UPDATE jobs SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('Job not found', 404);
    }

    return this.mapRowToJob(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    const result = await this.pool.query('DELETE FROM jobs WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('Job not found', 404);
    }
  }

  async deactivateExpiredJobs(): Promise<number> {
    const result = await this.pool.query(
      'UPDATE jobs SET is_active = false WHERE expires_date < CURRENT_TIMESTAMP AND is_active = true'
    );
    return result.rowCount || 0;
  }

  async getJobStats(): Promise<{
    total: number;
    active: number;
    remote: number;
    byType: Record<string, number>;
    byCompany: Record<string, number>;
  }> {
    const stats = await this.pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_active = true) as active,
        COUNT(*) FILTER (WHERE remote = true) as remote,
        json_object_agg(type, count) as by_type,
        json_object_agg(company, count) as by_company
      FROM (
        SELECT type, company, COUNT(*) as count
        FROM jobs
        WHERE is_active = true
        GROUP BY type, company
      ) t
    `);

    return {
      total: parseInt(stats.rows[0]?.total || '0'),
      active: parseInt(stats.rows[0]?.active || '0'),
      remote: parseInt(stats.rows[0]?.remote || '0'),
      byType: stats.rows[0]?.by_type || {},
      byCompany: stats.rows[0]?.by_company || {},
    };
  }

  async searchSimilarJobs(jobId: string, limit: number = 5): Promise<Job[]> {
    const job = await this.findById(jobId);
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    const result = await this.pool.query(
      `SELECT * FROM jobs 
       WHERE id != $1 
       AND is_active = true 
       AND (
         company = $2 OR 
         type = $3 OR 
         location ILIKE $4 OR
         tags && $5
       )
       ORDER BY posted_date DESC 
       LIMIT $6`,
      [jobId, job.company, job.type, `%${job.location}%`, job.tags, limit]
    );

    return result.rows.map(row => this.mapRowToJob(row));
  }

  private mapRowToJob(row: any): Job {
    return {
      id: row.id,
      title: row.title,
      company: row.company,
      companyLogo: row.company_logo,
      location: row.location,
      type: row.type,
      remote: row.remote,
      salary: row.salary_min || row.salary_max ? {
        min: row.salary_min,
        max: row.salary_max,
        currency: row.salary_currency,
      } : undefined,
      description: row.description,
      requirements: row.requirements || [],
      benefits: row.benefits || [],
      tags: row.tags || [],
      applyUrl: row.apply_url,
      sourceUrl: row.source_url,
      source: row.source,
      postedDate: row.posted_date,
      expiresDate: row.expires_date,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export default new JobModel();
