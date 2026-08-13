export interface DatabaseConfig {
  connectionString: string;
}

// Re-export type exports from this file only at the root level, so users can import them.
export * from './types';

import { Pool, PoolClient } from 'pg';

let pool: Pool | null = null;

export async function initDatabase(config: DatabaseConfig): Promise<Pool> {
  if (!pool) {
    pool = new Pool({
      connectionString: config.connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    // Test the connection
    const client = await pool.connect();
    client.release();
    console.log('✓ PostgreSQL connection established');
  }
  return pool;
}

export async function query<T>(text: string, params?: any[]): Promise<T> {
  if (!pool) throw new Error('Database not initialized. Call initDatabase() first.');
  const start = Date.now();
  
  try {
    const result = await pool!.query(text, params);
    const durationMs = Date.now() - start;
    console.log('[DB] %dms: %s', durationMs, text.slice(0, 100));
    return result.rows as T;
  } catch (err) {
    console.error('[DB Error]', err);
    throw err;
  }
}

export async function getClient(): Promise<PoolClient> {
  if (!pool) throw new Error('Database not initialized');
  const client = await pool!.connect();
  
  // Add query wrapper for logging in this session
  const origQuery = client.query.bind(client);
  client.query = (textOrConfig: any, params?: any[]) => {
    return origQuery(textOrConfig, params).then(result => {
      console.log('[Client Query] %s', textOrConfig.slice?.(0, 80) || textOrConfig.toString().slice(0, 80));
      return result;
    });
  };

  client.on('end', () => {
    console.log('[DB Client disconnected]');
  });

  return client;
}

