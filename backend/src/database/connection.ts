import { Pool } from 'pg';
import { databaseConfig } from '@/config';
import { logger } from '@/utils/logger';
import UserModel from '@/models/User';
import JobModel from '@/models/Job';

let pool: Pool | null = null;

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Create connection pool
    pool = new Pool({
      host: databaseConfig.host,
      port: databaseConfig.port,
      database: databaseConfig.database,
      user: databaseConfig.username,
      password: databaseConfig.password,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('Database connection established successfully');

    // Initialize tables
    await UserModel.createTable();
    await JobModel.createTable();

    logger.info('Database tables initialized successfully');

  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database connection closed');
  }
};

// Health check for database
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const client = await getPool().connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

export default {
  initializeDatabase,
  getPool,
  closeDatabase,
  checkDatabaseHealth,
};
