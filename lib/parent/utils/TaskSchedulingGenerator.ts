import { TechnicalTask, GeneratedFile } from '../types';

export class TaskSchedulingGenerator {
  /**
   * Generate task scheduling files based on project requirements
   */
  static generateSchedulingFiles(task: TechnicalTask): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    const taskLower = task.title.toLowerCase();
    const descLower = task.description.toLowerCase();
    const combined = `${taskLower} ${descLower} ${task.acceptance_criteria.join(' ').toLowerCase()}`;

    // Check if scheduling is needed
    if (this.needsScheduling(combined)) {
      // Generate main scheduler file
      files.push(this.generateMainScheduler());

      // Generate specific job files based on requirements
      if (combined.includes('email') || combined.includes('notification') || combined.includes('reminder')) {
        files.push(this.generateNotificationScheduler());
      }

      if (combined.includes('cleanup') || combined.includes('delete') || combined.includes('archive')) {
        files.push(this.generateCleanupScheduler());
      }

      if (combined.includes('report') || combined.includes('analytics') || combined.includes('summary')) {
        files.push(this.generateReportScheduler());
      }

      if (combined.includes('backup') || combined.includes('export')) {
        files.push(this.generateBackupScheduler());
      }

      // Generate job queue processor
      files.push(this.generateJobQueueProcessor());

      // Generate job types
      files.push(this.generateJobTypes());
    }

    return files;
  }

  private static needsScheduling(combined: string): boolean {
    const keywords = [
      'schedule', 'cron', 'daily', 'weekly', 'monthly',
      'reminder', 'notification', 'alert', 'email',
      'cleanup', 'archive', 'delete old',
      'report', 'summary', 'analytics',
      'backup', 'export', 'sync',
      'recurring', 'periodic', 'automated'
    ];

    return keywords.some(keyword => combined.includes(keyword));
  }

  private static generateMainScheduler(): GeneratedFile {
    return {
      path: 'src/jobs/scheduler.ts',
      type: 'other',
      content: `import cron from 'node-cron';
import { notificationJobs } from './notificationJobs';
import { cleanupJobs } from './cleanupJobs';
import { reportJobs } from './reportJobs';
import { backupJobs } from './backupJobs';

/**
 * Main scheduler that manages all cron jobs
 * Uses node-cron for reliable job scheduling
 */
export class JobScheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map();
  private isRunning: boolean = false;

  /**
   * Initialize and start all scheduled jobs
   */
  start(): void {
    if (this.isRunning) {
      console.warn('Scheduler is already running');
      return;
    }

    console.log('🕐 Starting job scheduler...');

    try {
      // Notification jobs
      this.scheduleJob(
        'daily-reminders',
        '0 9 * * *', // Every day at 9 AM
        notificationJobs.sendDailyReminders,
        'Send daily task reminders'
      );

      this.scheduleJob(
        'overdue-alerts',
        '0 */4 * * *', // Every 4 hours
        notificationJobs.sendOverdueAlerts,
        'Send overdue task alerts'
      );

      // Cleanup jobs
      this.scheduleJob(
        'cleanup-completed-tasks',
        '0 0 * * 0', // Every Sunday at midnight
        cleanupJobs.cleanupCompletedTasks,
        'Clean up old completed tasks'
      );

      this.scheduleJob(
        'cleanup-expired-sessions',
        '0 */6 * * *', // Every 6 hours
        cleanupJobs.cleanupExpiredSessions,
        'Clean up expired user sessions'
      );

      // Report jobs
      this.scheduleJob(
        'weekly-reports',
        '0 8 * * 1', // Every Monday at 8 AM
        reportJobs.generateWeeklyReports,
        'Generate weekly productivity reports'
      );

      this.scheduleJob(
        'monthly-analytics',
        '0 9 1 * *', // First day of month at 9 AM
        reportJobs.generateMonthlyAnalytics,
        'Generate monthly analytics'
      );

      // Backup jobs
      this.scheduleJob(
        'daily-backup',
        '0 2 * * *', // Every day at 2 AM
        backupJobs.performDailyBackup,
        'Perform daily database backup'
      );

      this.isRunning = true;
      console.log(\`✅ Scheduler started with \${this.jobs.size} jobs\`);
      this.logScheduledJobs();
    } catch (error) {
      console.error('Failed to start scheduler:', error);
      this.stop();
    }
  }

  /**
   * Schedule a single job
   */
  private scheduleJob(
    name: string,
    schedule: string,
    handler: () => Promise<void>,
    description: string
  ): void {
    try {
      const task = cron.schedule(schedule, async () => {
        const startTime = Date.now();
        console.log(\`[CRON] Starting job: \${name} at \${new Date().toISOString()}\`);

        try {
          await handler();
          const duration = Date.now() - startTime;
          console.log(\`[CRON] ✅ Completed job: \${name} (Duration: \${duration}ms)\`);
        } catch (error) {
          console.error(\`[CRON] ❌ Job failed: \${name}\`, error);
          // Log error to monitoring system
          this.logJobError(name, error);
        }
      });

      this.jobs.set(name, task);
      console.log(\`  ✓ Scheduled: \${name} - \${description} (\${schedule})\`);
    } catch (error) {
      console.error(\`Failed to schedule job \${name}\`, error);
    }
  }

  /**
   * Stop all scheduled jobs
   */
  stop(): void {
    console.log('🛑 Stopping job scheduler...');

    for (const [name, task] of this.jobs.entries()) {
      task.stop();
      console.log(\`  ✓ Stopped: \${name}\`);
    }

    this.jobs.clear();
    this.isRunning = false;
    console.log('✅ Scheduler stopped');
  }

  /**
   * Get status of all jobs
   */
  getStatus(): { name: string; running: boolean }[] {
    return Array.from(this.jobs.entries()).map(([name, task]) => ({
      name,
      running: this.isRunning
    }));
  }

  /**
   * Run a specific job manually (for testing)
   */
  async runJobManually(jobName: string): Promise<void> {
    console.log(\`[MANUAL] Running job: \${jobName}\`);

    // Map job names to handlers
    const jobHandlers: Record<string, () => Promise<void>> = {
      'daily-reminders': notificationJobs.sendDailyReminders,
      'overdue-alerts': notificationJobs.sendOverdueAlerts,
      'cleanup-completed-tasks': cleanupJobs.cleanupCompletedTasks,
      'cleanup-expired-sessions': cleanupJobs.cleanupExpiredSessions,
      'weekly-reports': reportJobs.generateWeeklyReports,
      'monthly-analytics': reportJobs.generateMonthlyAnalytics,
      'daily-backup': backupJobs.performDailyBackup
    };

    const handler = jobHandlers[jobName];
    if (!handler) {
      throw new Error(\`Unknown job: \${jobName}\`);
    }

    await handler();
    console.log(\`[MANUAL] ✅ Job completed: \${jobName}\`);
  }

  /**
   * Log all scheduled jobs with their schedules
   */
  private logScheduledJobs(): void {
    console.log('\\n📋 Scheduled Jobs:');
    console.log('━'.repeat(60));

    const jobDescriptions = [
      { name: 'daily-reminders', schedule: 'Daily at 9:00 AM', description: 'Send task reminders' },
      { name: 'overdue-alerts', schedule: 'Every 4 hours', description: 'Alert overdue tasks' },
      { name: 'cleanup-completed-tasks', schedule: 'Sunday at midnight', description: 'Clean old tasks' },
      { name: 'cleanup-expired-sessions', schedule: 'Every 6 hours', description: 'Clean sessions' },
      { name: 'weekly-reports', schedule: 'Monday at 8:00 AM', description: 'Weekly reports' },
      { name: 'monthly-analytics', schedule: '1st of month at 9:00 AM', description: 'Monthly analytics' },
      { name: 'daily-backup', schedule: 'Daily at 2:00 AM', description: 'Database backup' }
    ];

    for (const job of jobDescriptions) {
      if (this.jobs.has(job.name)) {
        console.log(\`  • \${job.name.padEnd(30)} | \${job.schedule.padEnd(25)} | \${job.description}\`);
      }
    }
    console.log('━'.repeat(60) + '\\n');
  }

  /**
   * Log job errors to monitoring system
   */
  private logJobError(jobName: string, error: unknown): void {
    // In production, this would send to error tracking service (Sentry, etc.)
    console.error({
      timestamp: new Date().toISOString(),
      job: jobName,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

// Export singleton instance
export const scheduler = new JobScheduler();
`
    };
  }

  private static generateNotificationScheduler(): GeneratedFile {
    return {
      path: 'src/jobs/notificationJobs.ts',
      type: 'other',
      content: `import { sendEmail } from '../services/emailService';
import { getTasksDueTomorrow, getOverdueTasks } from '../services/taskService';
import { getUsersByIds } from '../services/userService';

/**
 * Notification-related scheduled jobs
 */
export const notificationJobs = {
  /**
   * Send daily task reminders to users
   */
  async sendDailyReminders(): Promise<void> {
    console.log('📧 Sending daily task reminders...');

    try {
      // Get tasks due tomorrow
      const tasksDueTomorrow = await getTasksDueTomorrow();

      if (tasksDueTomorrow.length === 0) {
        console.log('No tasks due tomorrow');
        return;
      }

      // Group tasks by user
      const tasksByUser = new Map<string, any[]>();
      for (const task of tasksDueTomorrow) {
        const userId = task.userId;
        if (!tasksByUser.has(userId)) {
          tasksByUser.set(userId, []);
        }
        tasksByUser.get(userId)!.push(task);
      }

      // Get user details
      const userIds = Array.from(tasksByUser.keys());
      const users = await getUsersByIds(userIds);

      // Send emails
      let sentCount = 0;
      for (const user of users) {
        const userTasks = tasksByUser.get(user.id) || [];

        await sendEmail({
          to: user.email,
          subject: \`You have \${userTasks.length} task(s) due tomorrow\`,
          html: this.generateReminderEmail(user, userTasks)
        });

        sentCount++;
      }

      console.log(\`✅ Sent \${sentCount} reminder emails\`);
    } catch (error) {
      console.error('Failed to send daily reminders:', error);
      throw error;
    }
  },

  /**
   * Send alerts for overdue tasks
   */
  async sendOverdueAlerts(): Promise<void> {
    console.log('⚠️ Sending overdue task alerts...');

    try {
      const overdueTasks = await getOverdueTasks();

      if (overdueTasks.length === 0) {
        console.log('No overdue tasks');
        return;
      }

      // Group by user
      const tasksByUser = new Map<string, any[]>();
      for (const task of overdueTasks) {
        const userId = task.userId;
        if (!tasksByUser.has(userId)) {
          tasksByUser.set(userId, []);
        }
        tasksByUser.get(userId)!.push(task);
      }

      const userIds = Array.from(tasksByUser.keys());
      const users = await getUsersByIds(userIds);

      let sentCount = 0;
      for (const user of users) {
        const userTasks = tasksByUser.get(user.id) || [];

        await sendEmail({
          to: user.email,
          subject: \`⚠️ You have \${userTasks.length} overdue task(s)\`,
          html: this.generateOverdueEmail(user, userTasks),
          priority: 'high'
        });

        sentCount++;
      }

      console.log(\`✅ Sent \${sentCount} overdue alerts\`);
    } catch (error) {
      console.error('Failed to send overdue alerts:', error);
      throw error;
    }
  },

  /**
   * Generate reminder email HTML
   */
  generateReminderEmail(user: any, tasks: any[]): string {
    return \`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; border-radius: 5px; }
            .task { background: #f9fafb; padding: 15px; margin: 10px 0; border-left: 4px solid #4F46E5; }
            .task-title { font-weight: bold; color: #1f2937; }
            .task-priority { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 12px; }
            .priority-high { background: #fef2f2; color: #dc2626; }
            .priority-medium { background: #fffbeb; color: #f59e0b; }
            .priority-low { background: #f0fdf4; color: #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📅 Tasks Due Tomorrow</h2>
            </div>
            <p>Hi \${user.name},</p>
            <p>You have <strong>\${tasks.length}</strong> task(s) due tomorrow:</p>
            \${tasks.map(task => \`
              <div class="task">
                <div class="task-title">\${task.title}</div>
                <div class="task-priority priority-\${task.priority}">\${task.priority}</div>
                <p>\${task.description || 'No description'}</p>
              </div>
            \`).join('')}
            <p>Plan your day accordingly! 💪</p>
            <p>Best regards,<br>Your Task Management System</p>
          </div>
        </body>
      </html>
    \`;
  },

  /**
   * Generate overdue email HTML
   */
  generateOverdueEmail(user: any, tasks: any[]): string {
    return \`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; border-radius: 5px; }
            .task { background: #fef2f2; padding: 15px; margin: 10px 0; border-left: 4px solid #dc2626; }
            .task-title { font-weight: bold; color: #991b1b; }
            .overdue-days { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>⚠️ Overdue Tasks Alert</h2>
            </div>
            <p>Hi \${user.name},</p>
            <p>You have <strong>\${tasks.length}</strong> overdue task(s):</p>
            \${tasks.map(task => {
              const daysOverdue = Math.floor((Date.now() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24));
              return \`
                <div class="task">
                  <div class="task-title">\${task.title}</div>
                  <div class="overdue-days">Overdue by \${daysOverdue} day(s)</div>
                  <p>\${task.description || 'No description'}</p>
                </div>
              \`;
            }).join('')}
            <p>Please prioritize these tasks! 🚨</p>
            <p>Best regards,<br>Your Task Management System</p>
          </div>
        </body>
      </html>
    \`;
  }
};
`
    };
  }

  private static generateCleanupScheduler(): GeneratedFile {
    return {
      path: 'src/jobs/cleanupJobs.ts',
      type: 'other',
      content: `import { deleteOldCompletedTasks, deleteExpiredSessions } from '../services/cleanupService';

/**
 * Cleanup-related scheduled jobs
 */
export const cleanupJobs = {
  /**
   * Clean up old completed tasks (older than 30 days)
   */
  async cleanupCompletedTasks(): Promise<void> {
    console.log('🧹 Starting completed tasks cleanup...');

    try {
      const daysOld = 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const deletedCount = await deleteOldCompletedTasks(cutoffDate);

      console.log(\`✅ Cleaned up \${deletedCount} completed tasks older than \${daysOld} days\`);
    } catch (error) {
      console.error('Failed to cleanup completed tasks:', error);
      throw error;
    }
  },

  /**
   * Clean up expired user sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    console.log('🧹 Starting expired sessions cleanup...');

    try {
      const deletedCount = await deleteExpiredSessions();

      console.log(\`✅ Cleaned up \${deletedCount} expired sessions\`);
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
      throw error;
    }
  },

  /**
   * Clean up orphaned attachments (files with no associated task)
   */
  async cleanupOrphanedAttachments(): Promise<void> {
    console.log('🧹 Starting orphaned attachments cleanup...');

    try {
      // Implementation would check for files in storage that don't have database references
      const deletedCount = 0; // Placeholder

      console.log(\`✅ Cleaned up \${deletedCount} orphaned attachments\`);
    } catch (error) {
      console.error('Failed to cleanup orphaned attachments:', error);
      throw error;
    }
  }
};
`
    };
  }

  private static generateReportScheduler(): GeneratedFile {
    return {
      path: 'src/jobs/reportJobs.ts',
      type: 'other',
      content: `import { generateWeeklyReport, generateMonthlyReport } from '../services/reportService';
import { sendEmail } from '../services/emailService';
import { getAllActiveUsers } from '../services/userService';

/**
 * Report generation scheduled jobs
 */
export const reportJobs = {
  /**
   * Generate and send weekly productivity reports
   */
  async generateWeeklyReports(): Promise<void> {
    console.log('📊 Generating weekly reports...');

    try {
      const users = await getAllActiveUsers();
      let generatedCount = 0;

      for (const user of users) {
        const report = await generateWeeklyReport(user.id);

        if (report.totalTasks > 0) {
          await sendEmail({
            to: user.email,
            subject: '📊 Your Weekly Productivity Report',
            html: this.generateWeeklyReportEmail(user, report)
          });

          generatedCount++;
        }
      }

      console.log(\`✅ Generated and sent \${generatedCount} weekly reports\`);
    } catch (error) {
      console.error('Failed to generate weekly reports:', error);
      throw error;
    }
  },

  /**
   * Generate and send monthly analytics
   */
  async generateMonthlyAnalytics(): Promise<void> {
    console.log('📊 Generating monthly analytics...');

    try {
      const users = await getAllActiveUsers();
      let generatedCount = 0;

      for (const user of users) {
        const analytics = await generateMonthlyReport(user.id);

        await sendEmail({
          to: user.email,
          subject: '📈 Your Monthly Analytics Report',
          html: this.generateMonthlyReportEmail(user, analytics)
        });

        generatedCount++;
      }

      console.log(\`✅ Generated and sent \${generatedCount} monthly analytics\`);
    } catch (error) {
      console.error('Failed to generate monthly analytics:', error);
      throw error;
    }
  },

  /**
   * Generate weekly report email HTML
   */
  generateWeeklyReportEmail(user: any, report: any): string {
    return \`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; border-radius: 5px; }
            .stat { background: #f9fafb; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .stat-value { font-size: 32px; font-weight: bold; color: #10b981; }
            .stat-label { font-size: 14px; color: #6b7280; }
            .chart { margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📊 Weekly Productivity Report</h2>
              <p>Week of \${new Date().toLocaleDateString()}</p>
            </div>
            <p>Hi \${user.name},</p>
            <p>Here's your productivity summary for this week:</p>

            <div class="stat">
              <div class="stat-value">\${report.completedTasks}</div>
              <div class="stat-label">Tasks Completed</div>
            </div>

            <div class="stat">
              <div class="stat-value">\${report.completionRate}%</div>
              <div class="stat-label">Completion Rate</div>
            </div>

            <div class="stat">
              <div class="stat-value">\${report.totalHours}</div>
              <div class="stat-label">Hours Worked</div>
            </div>

            <p>Keep up the great work! 💪</p>
            <p>Best regards,<br>Your Task Management System</p>
          </div>
        </body>
      </html>
    \`;
  },

  /**
   * Generate monthly report email HTML
   */
  generateMonthlyReportEmail(user: any, analytics: any): string {
    return \`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; border-radius: 5px; }
            .stat { background: #f9fafb; padding: 15px; margin: 10px 0; border-radius: 5px; display: flex; justify-content: space-between; }
            .stat-value { font-size: 24px; font-weight: bold; color: #4F46E5; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📈 Monthly Analytics Report</h2>
            </div>
            <p>Hi \${user.name},</p>
            <p>Your performance this month:</p>

            <div class="stat">
              <span>Total Tasks:</span>
              <span class="stat-value">\${analytics.totalTasks}</span>
            </div>

            <div class="stat">
              <span>Completed:</span>
              <span class="stat-value">\${analytics.completedTasks}</span>
            </div>

            <div class="stat">
              <span>Average Time per Task:</span>
              <span class="stat-value">\${analytics.avgTimePerTask}h</span>
            </div>

            <p>Excellent progress! 🎉</p>
            <p>Best regards,<br>Your Task Management System</p>
          </div>
        </body>
      </html>
    \`;
  }
};
`
    };
  }

  private static generateBackupScheduler(): GeneratedFile {
    return {
      path: 'src/jobs/backupJobs.ts',
      type: 'other',
      content: `import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from '../config/environment';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Backup-related scheduled jobs
 */
export const backupJobs = {
  /**
   * Perform daily database backup
   */
  async performDailyBackup(): Promise<void> {
    console.log('💾 Starting daily database backup...');

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(process.cwd(), 'backups');
      const backupFile = path.join(backupDir, \`backup-\${timestamp}.sql\`);

      // Ensure backup directory exists
      await fs.mkdir(backupDir, { recursive: true });

      // Perform PostgreSQL backup
      const command = \`pg_dump -h \${config.dbHost} -p \${config.dbPort} -U \${config.dbUser} -d \${config.dbName} -F c -f \${backupFile}\`;

      await execAsync(command, {
        env: {
          ...process.env,
          PGPASSWORD: config.dbPassword
        }
      });

      // Get file size
      const stats = await fs.stat(backupFile);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log(\`✅ Database backup completed: \${backupFile} (\${fileSizeMB} MB)\`);

      // Clean up old backups (keep last 7 days)
      await this.cleanupOldBackups(backupDir, 7);
    } catch (error) {
      console.error('Failed to perform database backup:', error);
      throw error;
    }
  },

  /**
   * Clean up old backup files
   */
  async cleanupOldBackups(backupDir: string, daysToKeep: number): Promise<void> {
    try {
      const files = await fs.readdir(backupDir);
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

      let deletedCount = 0;

      for (const file of files) {
        if (file.startsWith('backup-')) {
          const filePath = path.join(backupDir, file);
          const stats = await fs.stat(filePath);
          const age = now - stats.mtimeMs;

          if (age > maxAge) {
            await fs.unlink(filePath);
            deletedCount++;
          }
        }
      }

      if (deletedCount > 0) {
        console.log(\`  Cleaned up \${deletedCount} old backup(s)\`);
      }
    } catch (error) {
      console.warn('Failed to cleanup old backups:', error);
    }
  }
};
`
    };
  }

  private static generateJobQueueProcessor(): GeneratedFile {
    return {
      path: 'src/jobs/queueProcessor.ts',
      type: 'other',
      content: `import Queue from 'bull';
import { config } from '../config/environment';
import { sendEmail } from '../services/emailService';
import { processFileUpload } from '../services/fileService';

/**
 * Background job queue processor using Bull
 * For tasks that need to be processed asynchronously
 */

// Create queues
export const emailQueue = new Queue('email', {
  redis: {
    host: config.redisHost || 'localhost',
    port: config.redisPort || 6379
  }
});

export const fileQueue = new Queue('file-processing', {
  redis: {
    host: config.redisHost || 'localhost',
    port: config.redisPort || 6379
  }
});

export const notificationQueue = new Queue('notifications', {
  redis: {
    host: config.redisHost || 'localhost',
    port: config.redisPort || 6379
  }
});

/**
 * Process email jobs
 */
emailQueue.process(async (job) => {
  const { to, subject, html } = job.data;
  console.log(\`[EMAIL QUEUE] Processing email to: \${to}\`);

  try {
    await sendEmail({ to, subject, html });
    return { success: true, recipient: to };
  } catch (error) {
    console.error(\`[EMAIL QUEUE] Failed to send email to \${to}\`, error);
    throw error;
  }
});

/**
 * Process file upload jobs
 */
fileQueue.process(async (job) => {
  const { fileId, filePath, userId } = job.data;
  console.log(\`[FILE QUEUE] Processing file: \${fileId}\`);

  try {
    await processFileUpload(fileId, filePath, userId);
    return { success: true, fileId };
  } catch (error) {
    console.error(\`[FILE QUEUE] Failed to process file \${fileId}\`, error);
    throw error;
  }
});

/**
 * Process notification jobs
 */
notificationQueue.process(async (job) => {
  const { userId, type, message } = job.data;
  console.log(\`[NOTIFICATION QUEUE] Processing notification for user: \${userId}\`);

  try {
    // Implementation would save notification to database and/or send push notification
    return { success: true, userId };
  } catch (error) {
    console.error(\`[NOTIFICATION QUEUE] Failed to process notification\`, error);
    throw error;
  }
});

/**
 * Event listeners for queue monitoring
 */
emailQueue.on('completed', (job, result) => {
  console.log(\`[EMAIL QUEUE] ✅ Job \${job.id} completed\`, result);
});

emailQueue.on('failed', (job, error) => {
  console.error(\`[EMAIL QUEUE] ❌ Job \${job?.id} failed\`, error);
});

fileQueue.on('completed', (job, result) => {
  console.log(\`[FILE QUEUE] ✅ Job \${job.id} completed\`, result);
});

fileQueue.on('failed', (job, error) => {
  console.error(\`[FILE QUEUE] ❌ Job \${job?.id} failed\`, error);
});

/**
 * Helper functions to add jobs to queues
 */
export const QueueHelpers = {
  /**
   * Add email to queue
   */
  async addEmailJob(emailData: { to: string; subject: string; html: string }) {
    await emailQueue.add(emailData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });
  },

  /**
   * Add file processing to queue
   */
  async addFileProcessingJob(fileData: { fileId: string; filePath: string; userId: string }) {
    await fileQueue.add(fileData, {
      attempts: 2,
      timeout: 300000 // 5 minutes
    });
  },

  /**
   * Add notification to queue
   */
  async addNotificationJob(notificationData: { userId: string; type: string; message: string }) {
    await notificationQueue.add(notificationData, {
      attempts: 3
    });
  }
};

/**
 * Graceful shutdown
 */
export async function closeQueues(): Promise<void> {
  console.log('Closing job queues...');
  await Promise.all([
    emailQueue.close(),
    fileQueue.close(),
    notificationQueue.close()
  ]);
  console.log('✅ All queues closed');
}
`
    };
  }

  private static generateJobTypes(): GeneratedFile {
    return {
      path: 'src/types/jobs.ts',
      type: 'other',
      content: `/**
 * Type definitions for scheduled jobs and background processing
 */

export interface EmailJob {
  to: string;
  subject: string;
  html: string;
  priority?: 'high' | 'normal' | 'low';
}

export interface FileProcessingJob {
  fileId: string;
  filePath: string;
  userId: string;
  fileType: string;
  fileSize: number;
}

export interface NotificationJob {
  userId: string;
  type: 'task_reminder' | 'task_assigned' | 'task_completed' | 'task_overdue' | 'comment_added';
  message: string;
  referenceId?: string;
  priority?: 'high' | 'normal' | 'low';
}

export interface BackupJob {
  type: 'full' | 'incremental';
  targetPath: string;
  timestamp: Date;
}

export interface ReportJob {
  userId: string;
  reportType: 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
}

export interface CleanupJob {
  type: 'completed_tasks' | 'expired_sessions' | 'orphaned_files';
  daysOld: number;
}

export interface JobResult {
  success: boolean;
  processedCount?: number;
  failedCount?: number;
  duration?: number;
  error?: string;
}

export interface JobSchedule {
  name: string;
  cronExpression: string;
  description: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}
`
    };
  }
}
