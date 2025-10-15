import { TechnicalTask } from '../types';

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
  indexes: DatabaseIndex[];
  foreignKeys: DatabaseForeignKey[];
}

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  unique: boolean;
  default?: string;
  isPrimaryKey: boolean;
}

export interface DatabaseIndex {
  name: string;
  columns: string[];
  unique: boolean;
}

export interface DatabaseForeignKey {
  columnName: string;
  referencedTable: string;
  referencedColumn: string;
  onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT';
}

export class DatabaseSchemaGenerator {
  /**
   * Analyze task and generate appropriate database schema
   */
  static generateSchemaFromTask(task: TechnicalTask): DatabaseTable[] {
    const taskLower = task.title.toLowerCase();
    const descLower = task.description.toLowerCase();
    const combined = `${taskLower} ${descLower} ${task.acceptance_criteria.join(' ').toLowerCase()}`;

    const tables: DatabaseTable[] = [];

    // Detect authentication/user management
    if (this.containsKeywords(combined, ['auth', 'login', 'register', 'user', 'account', 'profile'])) {
      tables.push(this.generateUsersTable());
    }

    // Detect task/todo management
    if (this.containsKeywords(combined, ['task', 'todo', 'item', 'project', 'work'])) {
      tables.push(this.generateTasksTable());

      // If users table exists, we can add task sharing
      if (tables.some(t => t.name === 'users')) {
        tables.push(this.generateTaskSharesTable());
      }
    }

    // Detect comments/notes
    if (this.containsKeywords(combined, ['comment', 'note', 'feedback', 'discussion'])) {
      tables.push(this.generateCommentsTable());
    }

    // Detect file/attachment management
    if (this.containsKeywords(combined, ['file', 'attachment', 'upload', 'document', 'media'])) {
      tables.push(this.generateAttachmentsTable());
    }

    // Detect notifications
    if (this.containsKeywords(combined, ['notification', 'alert', 'reminder', 'email'])) {
      tables.push(this.generateNotificationsTable());
    }

    // Detect teams/groups
    if (this.containsKeywords(combined, ['team', 'group', 'organization', 'workspace'])) {
      tables.push(this.generateTeamsTable());
      tables.push(this.generateTeamMembersTable());
    }

    // Detect categories/tags
    if (this.containsKeywords(combined, ['category', 'tag', 'label', 'organize'])) {
      tables.push(this.generateCategoriesTable());
      tables.push(this.generateTaskCategoriesTable());
    }

    // Detect analytics/logging
    if (this.containsKeywords(combined, ['analytics', 'log', 'audit', 'track', 'history'])) {
      tables.push(this.generateAuditLogsTable());
    }

    // If no specific tables detected, create a generic entities table
    if (tables.length === 0) {
      tables.push(this.generateGenericEntitiesTable(task));
    }

    return tables;
  }

  /**
   * Generate SQL from database tables
   */
  static generateSQL(tables: DatabaseTable[], dialect: 'postgresql' | 'mysql' = 'postgresql'): string {
    let sql = `-- Database Schema Migration\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- Dialect: ${dialect.toUpperCase()}\n\n`;

    if (dialect === 'postgresql') {
      sql += `-- Enable UUID extension\n`;
      sql += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n`;
    }

    sql += `BEGIN;\n\n`;

    // Generate CREATE TABLE statements
    for (const table of tables) {
      sql += this.generateTableSQL(table, dialect);
      sql += `\n`;
    }

    // Generate indexes (after tables are created)
    sql += `-- Indexes for performance optimization\n`;
    for (const table of tables) {
      for (const index of table.indexes) {
        sql += this.generateIndexSQL(table.name, index, dialect);
      }
    }

    sql += `\nCOMMIT;\n`;

    return sql;
  }

  private static generateTableSQL(table: DatabaseTable, dialect: 'postgresql' | 'mysql'): string {
    let sql = `-- ${table.name.charAt(0).toUpperCase() + table.name.slice(1)} table\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${table.name} (\n`;

    const columnDefs: string[] = [];

    // Add columns
    for (const col of table.columns) {
      let colDef = `  ${col.name} ${this.getColumnType(col, dialect)}`;

      if (col.isPrimaryKey) {
        colDef += ' PRIMARY KEY';
        if (col.type === 'uuid' && dialect === 'postgresql') {
          colDef += ` DEFAULT uuid_generate_v4()`;
        } else if (col.type === 'uuid' && dialect === 'mysql') {
          colDef += ` DEFAULT (UUID())`;
        }
      }

      if (!col.nullable && !col.isPrimaryKey) {
        colDef += ' NOT NULL';
      }

      if (col.unique && !col.isPrimaryKey) {
        colDef += ' UNIQUE';
      }

      if (col.default && !col.isPrimaryKey) {
        colDef += ` DEFAULT ${col.default}`;
      }

      columnDefs.push(colDef);
    }

    // Add foreign keys
    for (const fk of table.foreignKeys) {
      const fkDef = `  CONSTRAINT fk_${table.name}_${fk.columnName} FOREIGN KEY (${fk.columnName}) REFERENCES ${fk.referencedTable}(${fk.referencedColumn}) ON DELETE ${fk.onDelete}`;
      columnDefs.push(fkDef);
    }

    sql += columnDefs.join(',\n');
    sql += `\n);\n\n`;

    return sql;
  }

  private static generateIndexSQL(tableName: string, index: DatabaseIndex, dialect: 'postgresql' | 'mysql'): string {
    const uniqueStr = index.unique ? 'UNIQUE ' : '';
    return `CREATE ${uniqueStr}INDEX IF NOT EXISTS ${index.name} ON ${tableName}(${index.columns.join(', ')});\n`;
  }

  private static getColumnType(col: DatabaseColumn, dialect: 'postgresql' | 'mysql'): string {
    if (dialect === 'postgresql') {
      switch (col.type) {
        case 'uuid': return 'UUID';
        case 'string': return 'VARCHAR(255)';
        case 'text': return 'TEXT';
        case 'integer': return 'INTEGER';
        case 'bigint': return 'BIGINT';
        case 'boolean': return 'BOOLEAN';
        case 'timestamp': return 'TIMESTAMP';
        case 'date': return 'DATE';
        case 'json': return 'JSONB';
        case 'decimal': return 'DECIMAL(10, 2)';
        default: return 'VARCHAR(255)';
      }
    } else {
      switch (col.type) {
        case 'uuid': return 'CHAR(36)';
        case 'string': return 'VARCHAR(255)';
        case 'text': return 'TEXT';
        case 'integer': return 'INT';
        case 'bigint': return 'BIGINT';
        case 'boolean': return 'TINYINT(1)';
        case 'timestamp': return 'TIMESTAMP';
        case 'date': return 'DATE';
        case 'json': return 'JSON';
        case 'decimal': return 'DECIMAL(10, 2)';
        default: return 'VARCHAR(255)';
      }
    }
  }

  private static containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  // ==================== TABLE GENERATORS ====================

  private static generateUsersTable(): DatabaseTable {
    return {
      name: 'users',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'email', type: 'string', nullable: false, unique: true, isPrimaryKey: false },
        { name: 'password_hash', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'name', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'avatar_url', type: 'string', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'role', type: 'string', nullable: false, unique: false, isPrimaryKey: false, default: "'user'" },
        { name: 'is_active', type: 'boolean', nullable: false, unique: false, isPrimaryKey: false, default: 'true' },
        { name: 'email_verified', type: 'boolean', nullable: false, unique: false, isPrimaryKey: false, default: 'false' },
        { name: 'last_login_at', type: 'timestamp', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_users_email', columns: ['email'], unique: true },
        { name: 'idx_users_role', columns: ['role'], unique: false },
        { name: 'idx_users_created_at', columns: ['created_at'], unique: false }
      ],
      foreignKeys: []
    };
  }

  private static generateTasksTable(): DatabaseTable {
    return {
      name: 'tasks',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'title', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'description', type: 'text', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'status', type: 'string', nullable: false, unique: false, isPrimaryKey: false, default: "'pending'" },
        { name: 'priority', type: 'string', nullable: false, unique: false, isPrimaryKey: false, default: "'medium'" },
        { name: 'user_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'assigned_to', type: 'uuid', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'parent_task_id', type: 'uuid', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'due_date', type: 'timestamp', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'completed_at', type: 'timestamp', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_tasks_user_id', columns: ['user_id'], unique: false },
        { name: 'idx_tasks_assigned_to', columns: ['assigned_to'], unique: false },
        { name: 'idx_tasks_status', columns: ['status'], unique: false },
        { name: 'idx_tasks_priority', columns: ['priority'], unique: false },
        { name: 'idx_tasks_due_date', columns: ['due_date'], unique: false },
        { name: 'idx_tasks_parent_task_id', columns: ['parent_task_id'], unique: false }
      ],
      foreignKeys: [
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id', onDelete: 'CASCADE' },
        { columnName: 'assigned_to', referencedTable: 'users', referencedColumn: 'id', onDelete: 'SET NULL' },
        { columnName: 'parent_task_id', referencedTable: 'tasks', referencedColumn: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  private static generateTaskSharesTable(): DatabaseTable {
    return {
      name: 'task_shares',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'task_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'user_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'permission', type: 'string', nullable: false, unique: false, isPrimaryKey: false, default: "'view'" },
        { name: 'shared_by', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_task_shares_task_id', columns: ['task_id'], unique: false },
        { name: 'idx_task_shares_user_id', columns: ['user_id'], unique: false },
        { name: 'idx_task_shares_unique', columns: ['task_id', 'user_id'], unique: true }
      ],
      foreignKeys: [
        { columnName: 'task_id', referencedTable: 'tasks', referencedColumn: 'id', onDelete: 'CASCADE' },
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id', onDelete: 'CASCADE' },
        { columnName: 'shared_by', referencedTable: 'users', referencedColumn: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  private static generateCommentsTable(): DatabaseTable {
    return {
      name: 'comments',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'task_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'user_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'content', type: 'text', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'parent_comment_id', type: 'uuid', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_comments_task_id', columns: ['task_id'], unique: false },
        { name: 'idx_comments_user_id', columns: ['user_id'], unique: false },
        { name: 'idx_comments_created_at', columns: ['created_at'], unique: false }
      ],
      foreignKeys: [
        { columnName: 'task_id', referencedTable: 'tasks', referencedColumn: 'id', onDelete: 'CASCADE' },
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id', onDelete: 'CASCADE' },
        { columnName: 'parent_comment_id', referencedTable: 'comments', referencedColumn: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  private static generateAttachmentsTable(): DatabaseTable {
    return {
      name: 'attachments',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'task_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'user_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'file_name', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'file_path', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'file_size', type: 'bigint', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'mime_type', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_attachments_task_id', columns: ['task_id'], unique: false },
        { name: 'idx_attachments_user_id', columns: ['user_id'], unique: false }
      ],
      foreignKeys: [
        { columnName: 'task_id', referencedTable: 'tasks', referencedColumn: 'id', onDelete: 'CASCADE' },
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  private static generateNotificationsTable(): DatabaseTable {
    return {
      name: 'notifications',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'user_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'title', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'message', type: 'text', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'type', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'reference_id', type: 'uuid', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'is_read', type: 'boolean', nullable: false, unique: false, isPrimaryKey: false, default: 'false' },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_notifications_user_id', columns: ['user_id'], unique: false },
        { name: 'idx_notifications_is_read', columns: ['is_read'], unique: false },
        { name: 'idx_notifications_created_at', columns: ['created_at'], unique: false }
      ],
      foreignKeys: [
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  private static generateTeamsTable(): DatabaseTable {
    return {
      name: 'teams',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'name', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'description', type: 'text', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'owner_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_teams_owner_id', columns: ['owner_id'], unique: false }
      ],
      foreignKeys: [
        { columnName: 'owner_id', referencedTable: 'users', referencedColumn: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  private static generateTeamMembersTable(): DatabaseTable {
    return {
      name: 'team_members',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'team_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'user_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'role', type: 'string', nullable: false, unique: false, isPrimaryKey: false, default: "'member'" },
        { name: 'joined_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_team_members_team_id', columns: ['team_id'], unique: false },
        { name: 'idx_team_members_user_id', columns: ['user_id'], unique: false },
        { name: 'idx_team_members_unique', columns: ['team_id', 'user_id'], unique: true }
      ],
      foreignKeys: [
        { columnName: 'team_id', referencedTable: 'teams', referencedColumn: 'id', onDelete: 'CASCADE' },
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  private static generateCategoriesTable(): DatabaseTable {
    return {
      name: 'categories',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'name', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'color', type: 'string', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'user_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_categories_user_id', columns: ['user_id'], unique: false },
        { name: 'idx_categories_name_user', columns: ['name', 'user_id'], unique: true }
      ],
      foreignKeys: [
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  private static generateTaskCategoriesTable(): DatabaseTable {
    return {
      name: 'task_categories',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'task_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'category_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_task_categories_task_id', columns: ['task_id'], unique: false },
        { name: 'idx_task_categories_category_id', columns: ['category_id'], unique: false },
        { name: 'idx_task_categories_unique', columns: ['task_id', 'category_id'], unique: true }
      ],
      foreignKeys: [
        { columnName: 'task_id', referencedTable: 'tasks', referencedColumn: 'id', onDelete: 'CASCADE' },
        { columnName: 'category_id', referencedTable: 'categories', referencedColumn: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  private static generateAuditLogsTable(): DatabaseTable {
    return {
      name: 'audit_logs',
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'user_id', type: 'uuid', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'action', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'entity_type', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'entity_id', type: 'uuid', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'changes', type: 'json', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'ip_address', type: 'string', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'user_agent', type: 'string', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'idx_audit_logs_user_id', columns: ['user_id'], unique: false },
        { name: 'idx_audit_logs_entity', columns: ['entity_type', 'entity_id'], unique: false },
        { name: 'idx_audit_logs_created_at', columns: ['created_at'], unique: false }
      ],
      foreignKeys: [
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id', onDelete: 'SET NULL' }
      ]
    };
  }

  private static generateGenericEntitiesTable(task: TechnicalTask): DatabaseTable {
    const entityName = this.extractEntityName(task.title);

    return {
      name: entityName,
      columns: [
        { name: 'id', type: 'uuid', nullable: false, unique: true, isPrimaryKey: true },
        { name: 'name', type: 'string', nullable: false, unique: false, isPrimaryKey: false },
        { name: 'description', type: 'text', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'status', type: 'string', nullable: false, unique: false, isPrimaryKey: false, default: "'active'" },
        { name: 'user_id', type: 'uuid', nullable: true, unique: false, isPrimaryKey: false },
        { name: 'created_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', nullable: false, unique: false, isPrimaryKey: false, default: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: `idx_${entityName}_user_id`, columns: ['user_id'], unique: false },
        { name: `idx_${entityName}_status`, columns: ['status'], unique: false }
      ],
      foreignKeys: []
    };
  }

  private static extractEntityName(title: string): string {
    // Try to extract a meaningful entity name from the task title
    const words = title.toLowerCase().split(/\s+/);
    const commonVerbs = ['create', 'implement', 'build', 'develop', 'add', 'setup', 'configure'];

    // Remove common verbs
    const filtered = words.filter(w => !commonVerbs.includes(w));

    if (filtered.length > 0) {
      // Pluralize if not already plural
      let name = filtered[0];
      if (!name.endsWith('s')) {
        name += 's';
      }
      return name;
    }

    return 'entities';
  }
}
