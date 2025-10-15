import { GeneratedFile } from '../types';

export class DatabaseOptimizationGenerator {
  /**
   * Generate database configuration and optimization files
   */
  static generateOptimizationFiles(): GeneratedFile[] {
    return [
      this.generateDatabaseConnection(),
      this.generateQueryOptimization(),
      this.generateCachingLayer(),
      this.generateDatabaseHelpers()
    ];
  }

  private static generateDatabaseConnection(): GeneratedFile {
    return {
      path: 'src/config/database.ts',
      type: 'config',
      content: `import { Pool } from 'pg';
import { config } from './environment';

/**
 * PostgreSQL connection pool with optimization
 * Connection pooling significantly improves performance by reusing database connections
 */
class DatabaseConnection {
  private pool: Pool;
  private static instance: DatabaseConnection;

  private constructor() {
    this.pool = new Pool({
      host: config.dbHost,
      port: config.dbPort,
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,

      // Connection pool configuration for optimal performance
      max: 20, // Maximum number of clients in the pool
      min: 5, // Minimum number of clients to keep in the pool
      idleTimeoutMillis: 30000, // How long a client must remain idle before being closed
      connectionTimeoutMillis: 2000, // Maximum time to wait for a connection
      maxUses: 7500, // Close connection after this many uses

      // Statement timeout to prevent long-running queries
      statement_timeout: 30000, // 30 seconds

      // Connection health checks
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000
    });

    // Event listeners for monitoring
    this.pool.on('connect', (client) => {
      console.log('New database connection established');

      // Set optimization parameters for this connection
      client.query(\`
        SET statement_timeout = 30000;
        SET lock_timeout = 10000;
        SET idle_in_transaction_session_timeout = 60000;
      \`).catch(err => console.error('Failed to set connection parameters:', err));
    });

    this.pool.on('acquire', () => {
      console.log('Client acquired from pool');
    });

    this.pool.on('remove', () => {
      console.log('Client removed from pool');
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });
  }

  /**
   * Get singleton instance
   */
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Execute a query with automatic connection management
   */
  async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
    const start = Date.now();
    const client = await this.pool.connect();

    try {
      const result = await client.query(text, params);
      const duration = Date.now() - start;

      // Log slow queries (over 1 second)
      if (duration > 1000) {
        console.warn(\`Slow query detected (\${duration}ms):\`, text.substring(0, 100));
      }

      return result;
    } catch (error) {
      console.error('Query error:', error);
      console.error('Query text:', text);
      console.error('Query params:', params);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Execute a transaction with automatic rollback on error
   */
  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get connection pool statistics
   */
  getPoolStats(): {
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  } {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }

  /**
   * Close all connections gracefully
   */
  async close(): Promise<void> {
    console.log('Closing database connection pool...');
    await this.pool.end();
    console.log('Database connection pool closed');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health');
      return result.rows[0].health === 1;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const db = DatabaseConnection.getInstance();

/**
 * Database helper class with common CRUD operations
 */
export class BaseRepository<T = any> {
  constructor(private tableName: string) {}

  /**
   * Find by ID
   */
  async findById(id: string): Promise<T | null> {
    const result = await db.query<T>(
      \`SELECT * FROM \${this.tableName} WHERE id = $1 LIMIT 1\`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find by IDs
   */
  async findByIds(ids: string[]): Promise<T[]> {
    if (ids.length === 0) return [];

    const result = await db.query<T>(
      \`SELECT * FROM \${this.tableName} WHERE id = ANY($1)\`,
      [ids]
    );
    return result.rows;
  }

  /**
   * Find all with pagination
   */
  async findAll(limit: number = 100, offset: number = 0): Promise<T[]> {
    const result = await db.query<T>(
      \`SELECT * FROM \${this.tableName} ORDER BY created_at DESC LIMIT $1 OFFSET $2\`,
      [limit, offset]
    );
    return result.rows;
  }

  /**
   * Create record
   */
  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => \`$\${i + 1}\`).join(', ');

    const result = await db.query<T>(
      \`INSERT INTO \${this.tableName} (\${keys.join(', ')}) VALUES (\${placeholders}) RETURNING *\`,
      values
    );

    return result.rows[0];
  }

  /**
   * Update record
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => \`\${key} = $\${i + 2}\`).join(', ');

    const result = await db.query<T>(
      \`UPDATE \${this.tableName} SET \${setClause} WHERE id = $1 RETURNING *\`,
      [id, ...values]
    );

    return result.rows[0];
  }

  /**
   * Delete record
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.query(
      \`DELETE FROM \${this.tableName} WHERE id = $1\`,
      [id]
    );
    return (result.rowCount || 0) > 0;
  }

  /**
   * Soft delete record
   */
  async softDelete(id: string): Promise<T> {
    const result = await db.query<T>(
      \`UPDATE \${this.tableName} SET deleted_at = NOW() WHERE id = $1 RETURNING *\`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Count records
   */
  async count(whereClause: string = '', params: any[] = []): Promise<number> {
    const query = whereClause
      ? \`SELECT COUNT(*) as count FROM \${this.tableName} WHERE \${whereClause}\`
      : \`SELECT COUNT(*) as count FROM \${this.tableName}\`;

    const result = await db.query<{ count: string }>(query, params);
    return parseInt(result.rows[0].count);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database connections...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database connections...');
  await db.close();
  process.exit(0);
});
`
    };
  }

  private static generateQueryOptimization(): GeneratedFile {
    return {
      path: 'src/utils/queryOptimization.ts',
      type: 'other',
      content: `/**
 * Query optimization utilities
 * Best practices for writing efficient database queries
 */

/**
 * Build WHERE clause with multiple conditions efficiently
 */
export function buildWhereClause(
  conditions: Record<string, any>,
  startParam: number = 1
): { clause: string; values: any[]; nextParam: number } {
  const entries = Object.entries(conditions).filter(([_, v]) => v !== undefined);

  if (entries.length === 0) {
    return { clause: '', values: [], nextParam: startParam };
  }

  const clauses: string[] = [];
  const values: any[] = [];
  let paramIndex = startParam;

  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      // Use ANY for array values (more efficient than multiple ORs)
      clauses.push(\`\${key} = ANY($\${paramIndex})\`);
      values.push(value);
      paramIndex++;
    } else if (value === null) {
      clauses.push(\`\${key} IS NULL\`);
    } else {
      clauses.push(\`\${key} = $\${paramIndex}\`);
      values.push(value);
      paramIndex++;
    }
  }

  return {
    clause: 'WHERE ' + clauses.join(' AND '),
    values,
    nextParam: paramIndex
  };
}

/**
 * Build pagination clause with offset and limit
 */
export function buildPaginationClause(page: number = 1, pageSize: number = 50): {
  limit: number;
  offset: number;
} {
  const limit = Math.min(Math.max(pageSize, 1), 100); // Cap at 100
  const offset = Math.max((page - 1) * limit, 0);

  return { limit, offset };
}

/**
 * Build ORDER BY clause
 */
export function buildOrderByClause(
  sortField: string = 'created_at',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
): string {
  // Whitelist allowed sort fields to prevent SQL injection
  const allowedFields = [
    'id', 'created_at', 'updated_at', 'title', 'status', 'priority',
    'due_date', 'completed_at', 'name', 'email'
  ];

  if (!allowedFields.includes(sortField)) {
    sortField = 'created_at';
  }

  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return \`ORDER BY \${sortField} \${order}\`;
}

/**
 * Batch insert for better performance
 */
export function buildBatchInsert(
  tableName: string,
  records: Record<string, any>[]
): { query: string; values: any[] } {
  if (records.length === 0) {
    throw new Error('No records to insert');
  }

  const keys = Object.keys(records[0]);
  const valueRows: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const record of records) {
    const row = keys.map(() => \`$\${paramIndex++}\`).join(', ');
    valueRows.push(\`(\${row})\`);
    values.push(...keys.map(key => record[key]));
  }

  const query = \`
    INSERT INTO \${tableName} (\${keys.join(', ')})
    VALUES \${valueRows.join(', ')}
    RETURNING *
  \`;

  return { query, values };
}

/**
 * Build full-text search query (PostgreSQL specific)
 */
export function buildFullTextSearch(
  columns: string[],
  searchTerm: string
): { clause: string; value: string } {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return { clause: '', value: '' };
  }

  // Create tsquery from search term
  const tsquery = searchTerm
    .trim()
    .split(/\\s+/)
    .map(term => \`\${term}:*\`)
    .join(' & ');

  // Build tsvector from columns
  const tsvector = columns
    .map(col => \`to_tsvector('english', COALESCE(\${col}, ''))\`)
    .join(' || ');

  const clause = \`(\${tsvector}) @@ to_tsquery('english', $1)\`;

  return { clause, value: tsquery };
}

/**
 * Explain query for performance analysis (development only)
 */
export async function explainQuery(
  db: any,
  query: string,
  params: any[]
): Promise<any> {
  if (process.env.NODE_ENV === 'production') {
    console.warn('EXPLAIN queries should not be run in production');
    return null;
  }

  const explainQuery = \`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) \${query}\`;
  const result = await db.query(explainQuery, params);

  const plan = result.rows[0]['QUERY PLAN'][0];

  console.log('Query Plan:');
  console.log('  Execution Time:', plan['Execution Time'], 'ms');
  console.log('  Planning Time:', plan['Planning Time'], 'ms');
  console.log('  Total Cost:', plan.Plan['Total Cost']);

  return plan;
}

/**
 * Common query patterns
 */
export const QueryPatterns = {
  /**
   * Get with JOIN (efficient)
   */
  getWithJoin: (mainTable: string, joinTable: string, joinKey: string) => \`
    SELECT
      m.*,
      j.id as join_id,
      j.name as join_name
    FROM \${mainTable} m
    LEFT JOIN \${joinTable} j ON m.\${joinKey} = j.id
  \`,

  /**
   * Get with multiple conditions (using indexes)
   */
  getWithMultipleFilters: (table: string) => \`
    SELECT * FROM \${table}
    WHERE status = $1
      AND priority = $2
      AND created_at >= $3
    ORDER BY created_at DESC
    LIMIT $4 OFFSET $5
  \`,

  /**
   * Aggregate query with GROUP BY
   */
  getAggregated: (table: string, groupBy: string) => \`
    SELECT
      \${groupBy},
      COUNT(*) as count,
      AVG(some_value) as average,
      MAX(created_at) as latest
    FROM \${table}
    WHERE deleted_at IS NULL
    GROUP BY \${groupBy}
    ORDER BY count DESC
  \`,

  /**
   * Upsert (INSERT ... ON CONFLICT)
   */
  upsert: (table: string, conflictColumn: string) => \`
    INSERT INTO \${table} (id, name, value)
    VALUES ($1, $2, $3)
    ON CONFLICT (\${conflictColumn})
    DO UPDATE SET
      name = EXCLUDED.name,
      value = EXCLUDED.value,
      updated_at = NOW()
    RETURNING *
  \`
};
`
    };
  }

  private static generateCachingLayer(): GeneratedFile {
    return {
      path: 'src/utils/cache.ts',
      type: 'other',
      content: `import NodeCache from 'node-cache';

/**
 * In-memory caching layer for performance optimization
 * Reduces database load by caching frequently accessed data
 */
class CacheManager {
  private cache: NodeCache;
  private hitCount: number = 0;
  private missCount: number = 0;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300, // Default TTL: 5 minutes
      checkperiod: 60, // Check for expired keys every 60 seconds
      useClones: false, // Better performance, but be careful with mutations
      deleteOnExpire: true
    });

    // Log cache events
    this.cache.on('set', (key) => {
      console.log(\`Cache SET: \${key}\`);
    });

    this.cache.on('del', (key) => {
      console.log(\`Cache DEL: \${key}\`);
    });

    this.cache.on('expired', (key) => {
      console.log(\`Cache EXPIRED: \${key}\`);
    });
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);

    if (value !== undefined) {
      this.hitCount++;
      console.log(\`Cache HIT: \${key}\`);
    } else {
      this.missCount++;
      console.log(\`Cache MISS: \${key}\`);
    }

    return value;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 300);
  }

  /**
   * Delete value from cache
   */
  delete(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Delete all keys matching a pattern
   */
  deletePattern(pattern: string): number {
    const keys = this.cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));

    if (matchingKeys.length > 0) {
      return this.cache.del(matchingKeys);
    }

    return 0;
  }

  /**
   * Clear all cache
   */
  flush(): void {
    this.cache.flushAll();
    console.log('Cache flushed');
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    keys: number;
    hits: number;
    misses: number;
    hitRate: number;
  } {
    const keys = this.cache.keys().length;
    const total = this.hitCount + this.missCount;
    const hitRate = total > 0 ? (this.hitCount / total) * 100 : 0;

    return {
      keys,
      hits: this.hitCount,
      misses: this.missCount,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }

  /**
   * Get or set pattern (fetch from DB if not in cache)
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== undefined) {
      return cached;
    }

    // Fetch from source
    const value = await fetchFn();

    // Store in cache
    this.set(key, value, ttl);

    return value;
  }
}

// Export singleton instance
export const cache = new CacheManager();

/**
 * Cache key builders for consistency
 */
export const CacheKeys = {
  user: (id: string) => \`user:\${id}\`,
  userByEmail: (email: string) => \`user:email:\${email}\`,
  task: (id: string) => \`task:\${id}\`,
  taskList: (userId: string, page: number) => \`tasks:\${userId}:page:\${page}\`,
  taskComments: (taskId: string) => \`comments:\${taskId}\`,
  notifications: (userId: string) => \`notifications:\${userId}\`,
  stats: (userId: string, type: string) => \`stats:\${userId}:\${type}\`
};

/**
 * Cache invalidation helpers
 */
export const CacheInvalidation = {
  /**
   * Invalidate all user-related cache
   */
  invalidateUser: (userId: string) => {
    cache.deletePattern(\`user:\${userId}\`);
    cache.deletePattern(\`tasks:\${userId}\`);
    cache.deletePattern(\`stats:\${userId}\`);
  },

  /**
   * Invalidate all task-related cache
   */
  invalidateTask: (taskId: string) => {
    cache.delete(CacheKeys.task(taskId));
    cache.delete(CacheKeys.taskComments(taskId));
  },

  /**
   * Invalidate task lists
   */
  invalidateTaskLists: (userId: string) => {
    cache.deletePattern(\`tasks:\${userId}\`);
  }
};

/**
 * Decorator for caching function results
 */
export function Cached(ttl: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = \`\${target.constructor.name}:\${propertyKey}:\${JSON.stringify(args)}\`;

      return cache.getOrSet(cacheKey, () => originalMethod.apply(this, args), ttl);
    };

    return descriptor;
  };
}
`
    };
  }

  private static generateDatabaseHelpers(): GeneratedFile {
    return {
      path: 'src/utils/databaseHelpers.ts',
      type: 'other',
      content: `import { db } from '../config/database';

/**
 * Database utility functions
 */

/**
 * Check if record exists
 */
export async function recordExists(table: string, id: string): Promise<boolean> {
  const result = await db.query(
    \`SELECT EXISTS(SELECT 1 FROM \${table} WHERE id = $1) as exists\`,
    [id]
  );
  return result.rows[0].exists;
}

/**
 * Get next sequence value
 */
export async function getNextSequence(sequenceName: string): Promise<number> {
  const result = await db.query<{ nextval: number }>(
    \`SELECT nextval('\${sequenceName}') as nextval\`
  );
  return result.rows[0].nextval;
}

/**
 * Execute raw SQL safely
 */
export async function executeRaw(sql: string, params: any[] = []): Promise<any> {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Raw SQL execution in production should be avoided');
  }

  return await db.query(sql, params);
}

/**
 * Bulk update with CASE WHEN for better performance
 */
export async function bulkUpdate(
  table: string,
  updates: Array<{ id: string; values: Record<string, any> }>
): Promise<void> {
  if (updates.length === 0) return;

  const fields = Object.keys(updates[0].values);
  const ids = updates.map(u => u.id);

  // Build CASE statements for each field
  const caseStatements = fields.map(field => {
    const cases = updates
      .map(u => \`WHEN id = '\${u.id}' THEN '\${u.values[field]}'\`)
      .join(' ');

    return \`\${field} = CASE \${cases} END\`;
  });

  const query = \`
    UPDATE \${table}
    SET \${caseStatements.join(', ')}
    WHERE id = ANY($1)
  \`;

  await db.query(query, [ids]);
}

/**
 * Get table row count
 */
export async function getTableCount(table: string, whereClause?: string, params?: any[]): Promise<number> {
  const query = whereClause
    ? \`SELECT COUNT(*) as count FROM \${table} WHERE \${whereClause}\`
    : \`SELECT COUNT(*) as count FROM \${table}\`;

  const result = await db.query<{ count: string }>(query, params);
  return parseInt(result.rows[0].count);
}

/**
 * Get database size
 */
export async function getDatabaseSize(): Promise<string> {
  const result = await db.query<{ size: string }>(
    "SELECT pg_size_pretty(pg_database_size(current_database())) as size"
  );
  return result.rows[0].size;
}

/**
 * Get table sizes
 */
export async function getTableSizes(): Promise<Array<{ table: string; size: string }>> {
  const result = await db.query<{ table: string; size: string }>(\`
    SELECT
      tablename as table,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  \`);

  return result.rows;
}

/**
 * Vacuum analyze for maintenance
 */
export async function vacuumAnalyze(table?: string): Promise<void> {
  const query = table ? \`VACUUM ANALYZE \${table}\` : 'VACUUM ANALYZE';
  await db.query(query);
  console.log(\`Vacuum analyze completed\${table ? \` for \${table}\` : ''}\`);
}

/**
 * Get slow queries (PostgreSQL specific)
 */
export async function getSlowQueries(limit: number = 10): Promise<any[]> {
  const result = await db.query(\`
    SELECT
      query,
      calls,
      total_time,
      mean_time,
      max_time
    FROM pg_stat_statements
    ORDER BY mean_time DESC
    LIMIT $1
  \`, [limit]);

  return result.rows;
}

/**
 * Get database connections
 */
export async function getConnectionCount(): Promise<number> {
  const result = await db.query<{ count: string }>(\`
    SELECT COUNT(*) as count
    FROM pg_stat_activity
    WHERE datname = current_database()
  \`);

  return parseInt(result.rows[0].count);
}

/**
 * Kill idle connections
 */
export async function killIdleConnections(idleMinutes: number = 30): Promise<number> {
  const result = await db.query(\`
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = current_database()
      AND state = 'idle'
      AND state_change < NOW() - INTERVAL '\${idleMinutes} minutes'
  \`);

  return result.rowCount || 0;
}

/**
 * Check for missing indexes
 */
export async function findMissingIndexes(): Promise<any[]> {
  const result = await db.query(\`
    SELECT
      schemaname,
      tablename,
      attname as column_name,
      n_distinct,
      correlation
    FROM pg_stats
    WHERE schemaname = 'public'
      AND n_distinct > 100
      AND correlation < 0.1
    ORDER BY n_distinct DESC
  \`);

  return result.rows;
}
`
    };
  }
}
