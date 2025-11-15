import { TechnicalTask, GeneratedFile } from '../types';

export class BusinessLogicGenerator {
  static generateBusinessLogicFiles(task: TechnicalTask): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    const taskLower = task.title.toLowerCase();
    const descLower = task.description.toLowerCase();
    const combined = `${taskLower} ${descLower} ${task.acceptance_criteria.join(' ').toLowerCase()}`;

    // Task management business logic
    if (combined.includes('task') || combined.includes('todo') || combined.includes('item')) {
      files.push(this.generateTaskBusinessLogic());
    }

    // Task sharing/collaboration logic
    if (combined.includes('share') || combined.includes('collab') || combined.includes('team')) {
      files.push(this.generateSharingBusinessLogic());
    }

    // Notification logic
    if (combined.includes('notif') || combined.includes('alert') || combined.includes('reminder')) {
      files.push(this.generateNotificationBusinessLogic());
    }

    // Comment/discussion logic
    if (combined.includes('comment') || combined.includes('discuss') || combined.includes('feedback')) {
      files.push(this.generateCommentBusinessLogic());
    }

    // File attachment logic
    if (combined.includes('file') || combined.includes('attachment') || combined.includes('upload')) {
      files.push(this.generateFileBusinessLogic());
    }

    return files;
  }

  private static generateTaskBusinessLogic(): GeneratedFile {
    return {
      path: 'src/services/taskService.ts',
      type: 'other',
      content: `import { db } from '../config/database';
import { notificationService } from './notificationService';
import { auditLogService } from './auditLogService';

export class TaskService {
  async createTask(userId: string, taskData: CreateTaskData): Promise<Task> {
    this.validateTaskData(taskData);

    const task = await db.tasks.create({
      ...taskData,
      userId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Log audit trail
    await auditLogService.log({
      userId,
      action: 'task_created',
      entityType: 'task',
      entityId: task.id,
      changes: taskData
    });

    if (taskData.assignedTo && taskData.assignedTo !== userId) {
      await notificationService.notifyTaskAssigned(taskData.assignedTo, task);
    }

    return task;
  }

  async assignTask(taskId: string, assignedTo: string, assignedBy: string): Promise<Task> {
    const task = await db.tasks.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId !== assignedBy && task.assignedTo !== assignedBy) {
      throw new Error('You do not have permission to assign this task');
    }

    if (task.userId === assignedTo && assignedBy === task.userId) {
      throw new Error('Cannot assign task to yourself as the creator');
    }

    const targetUser = await db.users.findById(assignedTo);
    if (!targetUser || !targetUser.isActive) {
      throw new Error('Target user not found or inactive');
    }

    const previousAssignee = task.assignedTo;
    const updatedTask = await db.tasks.update(taskId, {
      assignedTo,
      updatedAt: new Date()
    });

    await auditLogService.log({
      userId: assignedBy,
      action: 'task_assigned',
      entityType: 'task',
      entityId: taskId,
      changes: {
        previousAssignee,
        newAssignee: assignedTo
      }
    });

    await notificationService.notifyTaskAssigned(assignedTo, updatedTask);

    if (previousAssignee && previousAssignee !== assignedTo) {
      await notificationService.notifyTaskUnassigned(previousAssignee, updatedTask);
    }

    return updatedTask;
  }

  async completeTask(taskId: string, userId: string): Promise<Task> {
    const task = await db.tasks.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.assignedTo !== userId && task.userId !== userId) {
      throw new Error('You do not have permission to complete this task');
    }

    const subtasks = await db.tasks.findByParentId(taskId);
    const incompleteSubtasks = subtasks.filter(st => st.status !== 'completed');
    if (incompleteSubtasks.length > 0) {
      throw new Error(\`Complete all \${incompleteSubtasks.length} subtask(s) first\`);
    }

    const updatedTask = await db.tasks.update(taskId, {
      status: 'completed',
      completedAt: new Date(),
      updatedAt: new Date()
    });

    // Log audit trail
    await auditLogService.log({
      userId,
      action: 'task_completed',
      entityType: 'task',
      entityId: taskId,
      changes: { status: 'completed' }
    });


    if (task.userId !== userId) {
      await notificationService.notifyTaskCompleted(task.userId, updatedTask);
    }


    await this.updateUserStatistics(userId);

    // Unblock dependent tasks
    await this.unblockDependentTasks(taskId);

    return updatedTask;
  }

  async updateTaskPriority(taskId: string, priority: TaskPriority, userId: string): Promise<Task> {
    const task = await db.tasks.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }


    if (task.userId !== userId && task.assignedTo !== userId) {
      throw new Error('You do not have permission to update this task');
    }

    const previousPriority = task.priority;


    const updatedTask = await db.tasks.update(taskId, {
      priority,
      updatedAt: new Date()
    });

    // Log audit trail
    await auditLogService.log({
      userId,
      action: 'task_priority_updated',
      entityType: 'task',
      entityId: taskId,
      changes: {
        previousPriority,
        newPriority: priority
      }
    });

    // If escalated to critical, notify stakeholders
    if (priority === 'critical') {
      await notificationService.notifyTaskEscalated(task, 'Priority escalated to critical');
    }

    return updatedTask;
  }

  async checkTaskEscalation(taskId: string): Promise<void> {
    const task = await db.tasks.findById(taskId);
    if (!task) return;

    const now = new Date();
    const isOverdue = task.dueDate && new Date(task.dueDate) < now;
    const isHighPriority = task.priority === 'high';

    if (isOverdue && isHighPriority && task.status !== 'completed') {
      // Auto-escalate to critical
      await db.tasks.update(taskId, {
        priority: 'critical',
        updatedAt: now
      });


      await db.comments.create({
        taskId,
        userId: 'system',
        content: 'Auto-escalated to critical priority due to overdue status',
        createdAt: now
      });


      await notificationService.notifyTaskEscalated(task, 'Task is overdue and has been escalated');

      // Log audit trail
      await auditLogService.log({
        userId: 'system',
        action: 'task_auto_escalated',
        entityType: 'task',
        entityId: taskId,
        changes: { priority: 'critical', reason: 'overdue' }
      });
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await db.tasks.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Only creator can delete
    if (task.userId !== userId) {
      throw new Error('Only the task creator can delete this task');
    }


    const dependentTasks = await db.tasks.findDependentTasks(taskId);
    if (dependentTasks.length > 0) {
      throw new Error(\`Cannot delete task with \${dependentTasks.length} dependent task(s)\`);
    }

    // Soft delete or hard delete based on configuration
    await db.tasks.softDelete(taskId);

    // Log audit trail
    await auditLogService.log({
      userId,
      action: 'task_deleted',
      entityType: 'task',
      entityId: taskId,
      changes: { deletedAt: new Date() }
    });


    if (task.assignedTo) {
      await notificationService.notifyTaskDeleted(task.assignedTo, task);
    }
  }

  async getTasksDueTomorrow(): Promise<Task[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    return await db.tasks.findByDueDateRange(tomorrow, dayAfterTomorrow);
  }

  async getOverdueTasks(): Promise<Task[]> {
    const now = new Date();
    return await db.tasks.findOverdue(now);
  }

  private validateTaskData(taskData: CreateTaskData): void {
    if (!taskData.title || taskData.title.trim().length === 0) {
      throw new Error('Task title is required');
    }

    if (taskData.title.length > 255) {
      throw new Error('Task title must be less than 255 characters');
    }

    if (taskData.dueDate) {
      const dueDate = new Date(taskData.dueDate);
      const now = new Date();
      if (dueDate < now) {
        throw new Error('Due date cannot be in the past');
      }
    }

    if (taskData.priority && !['low', 'medium', 'high', 'critical'].includes(taskData.priority)) {
      throw new Error('Invalid priority value');
    }
  }

  private async updateUserStatistics(userId: string): Promise<void> {
    const completedCount = await db.tasks.countCompletedByUser(userId);
    await db.users.update(userId, {
      totalCompletedTasks: completedCount
    });
  }

  private async unblockDependentTasks(taskId: string): Promise<void> {
    const dependentTasks = await db.tasks.findDependentTasks(taskId);

    for (const depTask of dependentTasks) {

      const allDepsCompleted = await this.areAllDependenciesCompleted(depTask.id);

      if (allDepsCompleted) {
        await db.tasks.update(depTask.id, {
          status: 'ready',
          updatedAt: new Date()
        });


        if (depTask.assignedTo) {
          await notificationService.notifyTaskUnblocked(depTask.assignedTo, depTask);
        }
      }
    }
  }

  private async areAllDependenciesCompleted(taskId: string): Promise<boolean> {
    const task = await db.tasks.findById(taskId);
    if (!task || !task.dependencies || task.dependencies.length === 0) {
      return true;
    }

    const dependencies = await db.tasks.findByIds(task.dependencies);
    return dependencies.every(dep => dep.status === 'completed');
  }
}

// Type definitions
export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  assignedTo?: string;
  parentTaskId?: string;
  dependencies?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  assignedTo?: string;
  parentTaskId?: string;
  dependencies?: string[];
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'pending' | 'in_progress' | 'ready' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export const taskService = new TaskService();
`
    };
  }

  private static generateSharingBusinessLogic(): GeneratedFile {
    return {
      path: 'src/services/sharingService.ts',
      type: 'other',
      content: `import { db } from '../config/database';
import { notificationService } from './notificationService';
import { auditLogService } from './auditLogService';

/**
 * Task sharing and collaboration business logic
 */
export class SharingService {
  /**
   * Share task with user(s)
   */
  async shareTask(
    taskId: string,
    sharedBy: string,
    userIds: string[],
    permission: SharePermission = 'view'
  ): Promise<void> {

    const task = await db.tasks.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }


    if (task.userId !== sharedBy && task.assignedTo !== sharedBy) {
      throw new Error('You do not have permission to share this task');
    }

    // Validate users exist
    const users = await db.users.findByIds(userIds);
    if (users.length !== userIds.length) {
      throw new Error('One or more users not found');
    }


    for (const userId of userIds) {

      const existingShare = await db.taskShares.findByTaskAndUser(taskId, userId);

      if (existingShare) {

        if (existingShare.permission !== permission) {
          await db.taskShares.update(existingShare.id, {
            permission,
            updatedAt: new Date()
          });
        }
      } else {

        await db.taskShares.create({
          taskId,
          userId,
          permission,
          sharedBy,
          createdAt: new Date()
        });


        await notificationService.notifyTaskShared(userId, task, sharedBy, permission);

        // Log audit trail
        await auditLogService.log({
          userId: sharedBy,
          action: 'task_shared',
          entityType: 'task',
          entityId: taskId,
          changes: { sharedWith: userId, permission }
        });
      }
    }
  }

  /**
   * Revoke task sharing
   */
  async revokeShare(taskId: string, userId: string, revokedBy: string): Promise<void> {
    const task = await db.tasks.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }


    if (task.userId !== revokedBy) {
      throw new Error('Only the task owner can revoke sharing');
    }


    const share = await db.taskShares.findByTaskAndUser(taskId, userId);
    if (!share) {
      throw new Error('Share not found');
    }

    await db.taskShares.delete(share.id);


    await notificationService.notifyShareRevoked(userId, task);

    // Log audit trail
    await auditLogService.log({
      userId: revokedBy,
      action: 'share_revoked',
      entityType: 'task',
      entityId: taskId,
      changes: { revokedFrom: userId }
    });
  }

  /**
   * Check if user has access to task
   */
  async canAccessTask(taskId: string, userId: string): Promise<boolean> {
    const task = await db.tasks.findById(taskId);
    if (!task) return false;

    // Owner or assignee has access
    if (task.userId === userId || task.assignedTo === userId) {
      return true;
    }


    const share = await db.taskShares.findByTaskAndUser(taskId, userId);
    return !!share;
  }

  /**
   * Check if user has specific permission on task
   */
  async hasPermission(
    taskId: string,
    userId: string,
    requiredPermission: SharePermission
  ): Promise<boolean> {
    const task = await db.tasks.findById(taskId);
    if (!task) return false;

    // Owner and assignee have full permissions
    if (task.userId === userId || task.assignedTo === userId) {
      return true;
    }


    const share = await db.taskShares.findByTaskAndUser(taskId, userId);
    if (!share) return false;

    // Permission hierarchy: edit > comment > view
    const permissionLevel = {
      view: 1,
      comment: 2,
      edit: 3
    };

    return permissionLevel[share.permission] >= permissionLevel[requiredPermission];
  }

  /**
   * Get all users who have access to a task
   */
  async getTaskCollaborators(taskId: string): Promise<TaskCollaborator[]> {
    const task = await db.tasks.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const collaborators: TaskCollaborator[] = [];


    const owner = await db.users.findById(task.userId);
    if (owner) {
      collaborators.push({
        user: owner,
        role: 'owner',
        permission: 'edit'
      });
    }


    if (task.assignedTo && task.assignedTo !== task.userId) {
      const assignee = await db.users.findById(task.assignedTo);
      if (assignee) {
        collaborators.push({
          user: assignee,
          role: 'assignee',
          permission: 'edit'
        });
      }
    }


    const shares = await db.taskShares.findByTask(taskId);
    for (const share of shares) {
      const user = await db.users.findById(share.userId);
      if (user) {
        collaborators.push({
          user,
          role: 'shared',
          permission: share.permission
        });
      }
    }

    return collaborators;
  }
}

export type SharePermission = 'view' | 'comment' | 'edit';

export interface TaskCollaborator {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  role: 'owner' | 'assignee' | 'shared';
  permission: SharePermission;
}

export const sharingService = new SharingService();
`
    };
  }

  private static generateNotificationBusinessLogic(): GeneratedFile {
    return {
      path: 'src/services/notificationService.ts',
      type: 'other',
      content: `import { db } from '../config/database';
import { QueueHelpers } from '../jobs/queueProcessor';

/**
 * Notification business logic
 * Handles all notification types with queuing for async processing
 */
export class NotificationService {
  /**
   * Notify user about task assignment
   */
  async notifyTaskAssigned(userId: string, task: any): Promise<void> {
    await this.createNotification({
      userId,
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: \`You have been assigned to: "\${task.title}"\`,
      referenceId: task.id
    });

    // Queue email notification
    await QueueHelpers.addEmailJob({
      to: (await db.users.findById(userId))?.email || '',
      subject: 'New Task Assigned to You',
      html: this.generateTaskAssignedEmail(task)
    });
  }

  /**
   * Notify user about task unassignment
   */
  async notifyTaskUnassigned(userId: string, task: any): Promise<void> {
    await this.createNotification({
      userId,
      type: 'task_unassigned',
      title: 'Task Unassigned',
      message: \`You have been unassigned from: "\${task.title}"\`,
      referenceId: task.id
    });
  }

  /**
   * Notify user about task completion
   */
  async notifyTaskCompleted(userId: string, task: any): Promise<void> {
    await this.createNotification({
      userId,
      type: 'task_completed',
      title: 'Task Completed',
      message: \`Your task "\${task.title}" has been completed\`,
      referenceId: task.id
    });
  }

  /**
   * Notify about task escalation
   */
  async notifyTaskEscalated(task: any, reason: string): Promise<void> {

    if (task.assignedTo) {
      await this.createNotification({
        userId: task.assignedTo,
        type: 'task_escalated',
        title: 'Task Escalated',
        message: \`Task "\${task.title}" has been escalated: \${reason}\`,
        referenceId: task.id
      });
    }


    if (task.userId && task.userId !== task.assignedTo) {
      await this.createNotification({
        userId: task.userId,
        type: 'task_escalated',
        title: 'Task Escalated',
        message: \`Your task "\${task.title}" has been escalated: \${reason}\`,
        referenceId: task.id
      });
    }
  }

  /**
   * Notify user about task sharing
   */
  async notifyTaskShared(userId: string, task: any, sharedBy: string, permission: string): Promise<void> {
    const sharer = await db.users.findById(sharedBy);

    await this.createNotification({
      userId,
      type: 'task_shared',
      title: 'Task Shared With You',
      message: \`\${sharer?.name || 'Someone'} shared a task with you: "\${task.title}" (\${permission} access)\`,
      referenceId: task.id
    });
  }

  /**
   * Notify user about share revocation
   */
  async notifyShareRevoked(userId: string, task: any): Promise<void> {
    await this.createNotification({
      userId,
      type: 'share_revoked',
      title: 'Task Share Revoked',
      message: \`Your access to task "\${task.title}" has been revoked\`,
      referenceId: task.id
    });
  }

  /**
   * Notify user about task deletion
   */
  async notifyTaskDeleted(userId: string, task: any): Promise<void> {
    await this.createNotification({
      userId,
      type: 'task_deleted',
      title: 'Task Deleted',
      message: \`Task "\${task.title}" has been deleted\`,
      referenceId: task.id
    });
  }

  /**
   * Notify user about task unblocking
   */
  async notifyTaskUnblocked(userId: string, task: any): Promise<void> {
    await this.createNotification({
      userId,
      type: 'task_unblocked',
      title: 'Task Ready',
      message: \`Task "\${task.title}" is now ready to work on\`,
      referenceId: task.id
    });
  }

  /**
   * Notify user about new comment
   */
  async notifyNewComment(userId: string, task: any, commenter: string): Promise<void> {
    const user = await db.users.findById(commenter);

    await this.createNotification({
      userId,
      type: 'comment_added',
      title: 'New Comment',
      message: \`\${user?.name || 'Someone'} commented on "\${task.title}"\`,
      referenceId: task.id
    });
  }

  /**
   * Create notification in database
   */
  private async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    referenceId?: string;
  }): Promise<void> {
    await db.notifications.create({
      ...data,
      isRead: false,
      createdAt: new Date()
    });

    // Also add to notification queue for real-time push
    await QueueHelpers.addNotificationJob({
      userId: data.userId,
      type: data.type as any,
      message: data.message,
      referenceId: data.referenceId
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await db.notifications.findById(notificationId);

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or access denied');
    }

    await db.notifications.update(notificationId, {
      isRead: true
    });
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await db.notifications.markAllReadByUser(userId);
  }

  /**
   * Get unread notifications for user
   */
  async getUnreadNotifications(userId: string): Promise<any[]> {
    return await db.notifications.findUnreadByUser(userId);
  }

  /**
   * Generate task assigned email HTML
   */
  private generateTaskAssignedEmail(task: any): string {
    return \`
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>New Task Assigned</h2>
          <p>You have been assigned a new task:</p>
          <div style="background: #f3f4f6; padding: 15px; margin: 10px 0;">
            <h3>\${task.title}</h3>
            <p>\${task.description || 'No description provided'}</p>
            <p><strong>Priority:</strong> \${task.priority}</p>
            <p><strong>Due Date:</strong> \${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
          </div>
          <p>Please review and take necessary action.</p>
        </body>
      </html>
    \`;
  }
}

export const notificationService = new NotificationService();
`
    };
  }

  private static generateCommentBusinessLogic(): GeneratedFile {
    return {
      path: 'src/services/commentService.ts',
      type: 'other',
      content: `import { db } from '../config/database';
import { notificationService } from './notificationService';
import { auditLogService } from './auditLogService';
import { sharingService } from './sharingService';

/**
 * Comment and discussion business logic
 */
export class CommentService {
  /**
   * Add comment to task
   */
  async addComment(taskId: string, userId: string, content: string, parentCommentId?: string): Promise<Comment> {

    const task = await db.tasks.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }


    const hasPermission = await sharingService.hasPermission(taskId, userId, 'comment');
    if (!hasPermission) {
      throw new Error('You do not have permission to comment on this task');
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content is required');
    }

    if (content.length > 5000) {
      throw new Error('Comment is too long (max 5000 characters)');
    }

    // If replying to a comment, check parent exists
    if (parentCommentId) {
      const parentComment = await db.comments.findById(parentCommentId);
      if (!parentComment || parentComment.taskId !== taskId) {
        throw new Error('Parent comment not found');
      }
    }


    const comment = await db.comments.create({
      taskId,
      userId,
      content: content.trim(),
      parentCommentId,
      createdAt: new Date(),
      updatedAt: new Date()
    });


    await db.tasks.update(taskId, {
      lastActivityAt: new Date()
    });

    // Log audit trail
    await auditLogService.log({
      userId,
      action: 'comment_added',
      entityType: 'task',
      entityId: taskId,
      changes: { commentId: comment.id }
    });


    await this.notifyTaskParticipants(taskId, userId, task);

    // If replying to someone, notify them specifically
    if (parentCommentId) {
      const parentComment = await db.comments.findById(parentCommentId);
      if (parentComment && parentComment.userId !== userId) {
        await notificationService.notifyNewComment(parentComment.userId, task, userId);
      }
    }

    return comment;
  }

  /**
   * Edit comment
   */
  async editComment(commentId: string, userId: string, newContent: string): Promise<Comment> {
    const comment = await db.comments.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Only commenter can edit
    if (comment.userId !== userId) {
      throw new Error('You can only edit your own comments');
    }

    // Validate content
    if (!newContent || newContent.trim().length === 0) {
      throw new Error('Comment content is required');
    }


    const updated = await db.comments.update(commentId, {
      content: newContent.trim(),
      updatedAt: new Date(),
      isEdited: true
    });

    // Log audit trail
    await auditLogService.log({
      userId,
      action: 'comment_edited',
      entityType: 'comment',
      entityId: commentId,
      changes: { previousContent: comment.content, newContent }
    });

    return updated;
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await db.comments.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }


    const task = await db.tasks.findById(comment.taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Only commenter or task owner can delete
    if (comment.userId !== userId && task.userId !== userId) {
      throw new Error('You do not have permission to delete this comment');
    }


    const replies = await db.comments.findReplies(commentId);
    if (replies.length > 0) {
      // Soft delete with placeholder text
      await db.comments.update(commentId, {
        content: '[Comment deleted]',
        deletedAt: new Date()
      });
    } else {
      // Hard delete if no replies
      await db.comments.delete(commentId);
    }

    // Log audit trail
    await auditLogService.log({
      userId,
      action: 'comment_deleted',
      entityType: 'comment',
      entityId: commentId,
      changes: { deletedAt: new Date() }
    });
  }

  /**
   * Get comments for a task with threading
   */
  async getTaskComments(taskId: string, userId: string): Promise<ThreadedComment[]> {

    const hasAccess = await sharingService.canAccessTask(taskId, userId);
    if (!hasAccess) {
      throw new Error('You do not have access to this task');
    }


    const comments = await db.comments.findByTask(taskId);

    // Build threaded structure
    return this.buildCommentThread(comments);
  }

  /**
   * Build threaded comment structure
   */
  private buildCommentThread(comments: any[]): ThreadedComment[] {
    const commentMap = new Map<string, ThreadedComment>();
    const rootComments: ThreadedComment[] = [];

    // First pass: create comment objects
    for (const comment of comments) {
      commentMap.set(comment.id, {
        ...comment,
        replies: []
      });
    }

    // Second pass: build hierarchy
    for (const comment of comments) {
      const threadedComment = commentMap.get(comment.id)!;

      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies.push(threadedComment);
        }
      } else {
        rootComments.push(threadedComment);
      }
    }

    // Sort by date
    this.sortCommentsByDate(rootComments);

    return rootComments;
  }

  /**
   * Sort comments by date recursively
   */
  private sortCommentsByDate(comments: ThreadedComment[]): void {
    comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    for (const comment of comments) {
      if (comment.replies.length > 0) {
        this.sortCommentsByDate(comment.replies);
      }
    }
  }

  /**
   * Notify task participants about new comment
   */
  private async notifyTaskParticipants(taskId: string, commenterId: string, task: any): Promise<void> {
    const collaborators = await sharingService.getTaskCollaborators(taskId);

    for (const collaborator of collaborators) {
      // Don't notify the commenter
      if (collaborator.user.id !== commenterId) {
        await notificationService.notifyNewComment(collaborator.user.id, task, commenterId);
      }
    }
  }
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  isEdited: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThreadedComment extends Comment {
  replies: ThreadedComment[];
}

export const commentService = new CommentService();
`
    };
  }

  private static generateFileBusinessLogic(): GeneratedFile {
    return {
      path: 'src/services/fileService.ts',
      type: 'other',
      content: `import { db } from '../config/database';
import { sharingService } from './sharingService';
import { auditLogService } from './auditLogService';
import { QueueHelpers } from '../jobs/queueProcessor';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/**
 * File attachment business logic
 */
export class FileService {
  private uploadDir = path.join(process.cwd(), 'uploads');
  private maxFileSize = 50 * 1024 * 1024; // 50MB
  private allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv',
    'application/zip', 'application/x-rar-compressed'
  ];

  constructor() {
    this.ensureUploadDirectoryExists();
  }

  /**
   * Upload file to task
   */
  async uploadFile(
    taskId: string,
    userId: string,
    file: FileUpload
  ): Promise<Attachment> {

    const task = await db.tasks.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const hasPermission = await sharingService.hasPermission(taskId, userId, 'edit');
    if (!hasPermission) {
      throw new Error('You do not have permission to upload files to this task');
    }

    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const fileExtension = path.extname(file.originalName);
    const uniqueFilename = \`\${crypto.randomBytes(16).toString('hex')}\${fileExtension}\`;
    const filePath = path.join(this.uploadDir, uniqueFilename);

    // Save file
    await fs.writeFile(filePath, file.buffer);


    const attachment = await db.attachments.create({
      taskId,
      userId,
      fileName: file.originalName,
      filePath: uniqueFilename,
      fileSize: file.size,
      mimeType: file.mimeType,
      createdAt: new Date()
    });

    // Queue for processing (virus scan, thumbnail generation, etc.)
    await QueueHelpers.addFileProcessingJob({
      fileId: attachment.id,
      filePath: uniqueFilename,
      userId
    });

    // Log audit trail
    await auditLogService.log({
      userId,
      action: 'file_uploaded',
      entityType: 'task',
      entityId: taskId,
      changes: {
        fileName: file.originalName,
        fileSize: file.size
      }
    });

    return attachment;
  }

  /**
   * Download/retrieve file
   */
  async getFile(attachmentId: string, userId: string): Promise<{ filePath: string; fileName: string }> {
    const attachment = await db.attachments.findById(attachmentId);
    if (!attachment) {
      throw new Error('Attachment not found');
    }


    const hasAccess = await sharingService.canAccessTask(attachment.taskId, userId);
    if (!hasAccess) {
      throw new Error('You do not have access to this file');
    }

    const fullPath = path.join(this.uploadDir, attachment.filePath);


    try {
      await fs.access(fullPath);
    } catch {
      throw new Error('File not found on disk');
    }

    return {
      filePath: fullPath,
      fileName: attachment.fileName
    };
  }

  /**
   * Delete file
   */
  async deleteFile(attachmentId: string, userId: string): Promise<void> {
    const attachment = await db.attachments.findById(attachmentId);
    if (!attachment) {
      throw new Error('Attachment not found');
    }

    const task = await db.tasks.findById(attachment.taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Only uploader or task owner can delete
    if (attachment.userId !== userId && task.userId !== userId) {
      throw new Error('You do not have permission to delete this file');
    }


    const fullPath = path.join(this.uploadDir, attachment.filePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.warn(\`Failed to delete file from disk: \${fullPath}\`, error);
    }


    await db.attachments.delete(attachmentId);

    // Log audit trail
    await auditLogService.log({
      userId,
      action: 'file_deleted',
      entityType: 'task',
      entityId: attachment.taskId,
      changes: {
        fileName: attachment.fileName,
        attachmentId
      }
    });
  }

  /**
   * Get all attachments for a task
   */
  async getTaskAttachments(taskId: string, userId: string): Promise<Attachment[]> {
    const hasAccess = await sharingService.canAccessTask(taskId, userId);
    if (!hasAccess) {
      throw new Error('You do not have access to this task');
    }

    return await db.attachments.findByTask(taskId);
  }

  /**
   * Process uploaded file (called by job queue)
   */
  async processFileUpload(fileId: string, filePath: string, userId: string): Promise<void> {
    console.log(\`Processing file: \${fileId}\`);

    // Here you would:
    // 1. Run virus scan
    // 2. Generate thumbnails for images
    // 3. Extract metadata
    // 4. Generate preview for documents
    // etc.

    // For now, just mark as processed
    await db.attachments.update(fileId, {
      processed: true,
      processedAt: new Date()
    });
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: FileUpload): void {

    if (file.size > this.maxFileSize) {
      throw new Error(\`File too large. Maximum size is \${this.maxFileSize / 1024 / 1024}MB\`);
    }


    if (!this.allowedMimeTypes.includes(file.mimeType)) {
      throw new Error(\`File type not allowed: \${file.mimeType}\`);
    }


    if (!file.originalName || file.originalName.length > 255) {
      throw new Error('Invalid file name');
    }
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }
}

export interface FileUpload {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface Attachment {
  id: string;
  taskId: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  processed?: boolean;
  processedAt?: Date;
  createdAt: Date;
}

export const fileService = new FileService();

// Helper functions for use in other services
export async function processFileUpload(fileId: string, filePath: string, userId: string): Promise<void> {
  await fileService.processFileUpload(fileId, filePath, userId);
}
`
    };
  }
}
