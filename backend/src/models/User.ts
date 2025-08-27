import { Pool, PoolClient } from 'pg';
import bcrypt from 'bcryptjs';
import { User, UserProfile, JobPreferences } from '@/types';
import { databaseConfig, securityConfig } from '@/config';
import { AppError } from '@/utils/errors';

export class UserModel {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(databaseConfig);
  }

  async createTable(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(254) UNIQUE NOT NULL,
          name VARCHAR(50) NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          bio TEXT,
          location VARCHAR(100),
          skills TEXT[] DEFAULT '{}',
          experience TEXT,
          education TEXT,
          resume VARCHAR(255),
          preferences JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
      `);
    } finally {
      client.release();
    }
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password!, securityConfig.bcryptRounds);

      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, name, password, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, email, name, role, created_at, updated_at`,
        [userData.email, userData.name, hashedPassword, userData.role]
      );

      const user = userResult.rows[0];

      // Create default user profile
      const defaultPreferences: JobPreferences = {
        remote: false,
        locations: [],
        jobTypes: ['full-time'],
        salaryRange: { min: 0, max: 200000 },
        industries: [],
      };

      await client.query(
        `INSERT INTO user_profiles (user_id, preferences) 
         VALUES ($1, $2)`,
        [user.id, JSON.stringify(defaultPreferences)]
      );

      await client.query('COMMIT');

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new AppError('Email already exists', 400);
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query(
      `SELECT id, email, name, role, created_at, updated_at 
       FROM users 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      `SELECT id, email, name, password, role, created_at, updated_at 
       FROM users 
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }

    if (updates.email) {
      fields.push(`email = $${paramCount++}`);
      values.push(updates.email);
    }

    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, securityConfig.bcryptRounds);
      fields.push(`password = $${paramCount++}`);
      values.push(hashedPassword);
    }

    if (updates.role) {
      fields.push(`role = $${paramCount++}`);
      values.push(updates.role);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.pool.query(
      `UPDATE users 
       SET ${fields.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING id, email, name, role, created_at, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async delete(id: string): Promise<void> {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('User not found', 404);
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const result = await this.pool.query(
      `SELECT id, user_id, bio, location, skills, experience, education, resume, preferences, created_at, updated_at 
       FROM user_profiles 
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) return null;

    const profile = result.rows[0];
    return {
      id: profile.id,
      userId: profile.user_id,
      bio: profile.bio,
      location: profile.location,
      skills: profile.skills || [],
      experience: profile.experience,
      education: profile.education,
      resume: profile.resume,
      preferences: profile.preferences,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.bio !== undefined) {
      fields.push(`bio = $${paramCount++}`);
      values.push(updates.bio);
    }

    if (updates.location !== undefined) {
      fields.push(`location = $${paramCount++}`);
      values.push(updates.location);
    }

    if (updates.skills !== undefined) {
      fields.push(`skills = $${paramCount++}`);
      values.push(updates.skills);
    }

    if (updates.experience !== undefined) {
      fields.push(`experience = $${paramCount++}`);
      values.push(updates.experience);
    }

    if (updates.education !== undefined) {
      fields.push(`education = $${paramCount++}`);
      values.push(updates.education);
    }

    if (updates.resume !== undefined) {
      fields.push(`resume = $${paramCount++}`);
      values.push(updates.resume);
    }

    if (updates.preferences !== undefined) {
      fields.push(`preferences = $${paramCount++}`);
      values.push(JSON.stringify(updates.preferences));
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await this.pool.query(
      `UPDATE user_profiles 
       SET ${fields.join(', ')} 
       WHERE user_id = $${paramCount} 
       RETURNING id, user_id, bio, location, skills, experience, education, resume, preferences, created_at, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      // Create profile if it doesn't exist
      const insertResult = await this.pool.query(
        `INSERT INTO user_profiles (user_id, bio, location, skills, experience, education, resume, preferences) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING id, user_id, bio, location, skills, experience, education, resume, preferences, created_at, updated_at`,
        [
          userId,
          updates.bio || null,
          updates.location || null,
          updates.skills || [],
          updates.experience || null,
          updates.education || null,
          updates.resume || null,
          JSON.stringify(updates.preferences || {}),
        ]
      );

      const profile = insertResult.rows[0];
      return {
        id: profile.id,
        userId: profile.user_id,
        bio: profile.bio,
        location: profile.location,
        skills: profile.skills || [],
        experience: profile.experience,
        education: profile.education,
        resume: profile.resume,
        preferences: profile.preferences,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    }

    const profile = result.rows[0];
    return {
      id: profile.id,
      userId: profile.user_id,
      bio: profile.bio,
      location: profile.location,
      skills: profile.skills || [],
      experience: profile.experience,
      education: profile.education,
      resume: profile.resume,
      preferences: profile.preferences,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const result = await this.pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) return false;

    return bcrypt.compare(password, result.rows[0].password);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const isValid = await this.verifyPassword(userId, currentPassword);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, securityConfig.bcryptRounds);
    await this.pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, userId]
    );
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export default new UserModel();
