import { BaseAgent } from './BaseAgent';
import { TechnicalTask, AgentResponse, GeneratedFile } from '../types';

export class BackendAgent extends BaseAgent {
  constructor() {
    super('Backend Agent', ['backend', 'api', 'database', 'business_logic']);
  }

  async executeTask(task: TechnicalTask): Promise<AgentResponse> {
    if (!this.validateTask(task) || task.type !== 'backend') {
      return {
        success: false,
        output: '',
        error: 'Invalid backend task'
      };
    }

    try {
      const files = await this.generateBackendCode(task);
      const output = this.generateTaskOutput(task, files);

      return {
        success: true,
        output,
        files
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Backend generation failed'
      };
    }
  }

  private async generateBackendCode(task: TechnicalTask): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    const taskTitle = task.title.toLowerCase();

    if (taskTitle.includes('auth') || taskTitle.includes('user')) {
      files.push(...this.generateAuthBackend(task));
    }

    if (taskTitle.includes('task') || taskTitle.includes('todo')) {
      files.push(...this.generateTaskBackend(task));
    }

    if (taskTitle.includes('shar')) {
      files.push(...this.generateSharingBackend(task));
    }

    if (taskTitle.includes('api') || taskTitle.includes('foundation')) {
      files.push(...this.generateAPIFoundation(task));
    }

    if (taskTitle.includes('database') || taskTitle.includes('schema')) {
      files.push(...this.generateDatabaseSchema(task));
    }

    return files;
  }

  private generateAuthBackend(task: TechnicalTask): GeneratedFile[] {
    const authController = {
      path: 'src/controllers/AuthController.ts',
      type: 'api' as const,
      content: `import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { validateEmail, validatePassword } from '../utils/validation';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Validation
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
      }

      if (!validateEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

      if (!validatePassword(password)) {
        res.status(400).json({
          error: 'Password must be at least 6 characters long'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: 'User already exists with this email' });
        return;
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword
      });

      // Generate JWT token
      const token = this.generateToken(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // Find user
      const user = await User.findByEmail(email.toLowerCase().trim());
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const token = this.generateToken(user.id);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId; // Set by auth middleware

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { name } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }

      const updatedUser = await User.updateById(userId, {
        name: name.trim()
      });

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign(
      { userId },
      secret,
      { expiresIn: '24h' }
    );
  }
}`
    };

    const authMiddleware = {
      path: 'src/middleware/auth.ts',
      type: 'other' as const,
      content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'your-secret-key';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    req.userId = (decoded as any).userId;
    next();
  });
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  const secret = process.env.JWT_SECRET || 'your-secret-key';

  jwt.verify(token, secret, (err, decoded) => {
    if (!err) {
      req.userId = (decoded as any).userId;
    }
    next();
  });
};`
    };

    const userModel = {
      path: 'src/models/User.ts',
      type: 'schema' as const,
      content: `export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

// Mock database - replace with actual database implementation
class UserModel {
  private users: User[] = [];
  private nextId = 1;

  async create(userData: CreateUserData): Promise<User> {
    const user: User = {
      id: this.nextId.toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(user);
    this.nextId++;

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  async updateById(id: string, updateData: UpdateUserData): Promise<User | null> {
    const userIndex = this.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return this.users[userIndex];
  }

  async deleteById(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}

export const User = new UserModel();`
    };

    const validationUtils = {
      path: 'src/utils/validation.ts',
      type: 'other' as const,
      content: `export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateRequired = (value: any): boolean => {
  return value !== undefined && value !== null && value !== '';
};

export const validateStringLength = (
  value: string,
  minLength: number,
  maxLength?: number
): boolean => {
  if (!value) return false;

  if (value.length < minLength) return false;
  if (maxLength && value.length > maxLength) return false;

  return true;
};

export const sanitizeString = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};`
    };

    return [authController, authMiddleware, userModel, validationUtils];
  }

  private generateTaskBackend(task: TechnicalTask): GeneratedFile[] {
    const taskController = {
      path: 'src/controllers/TaskController.ts',
      type: 'api' as const,
      content: `import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export class TaskController {
  async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { title, description, priority } = req.body;

      if (!title || !title.trim()) {
        res.status(400).json({ error: 'Task title is required' });
        return;
      }

      const task = await Task.create({
        title: title.trim(),
        description: description?.trim() || '',
        priority: priority || 'medium',
        userId
      });

      res.status(201).json({
        message: 'Task created successfully',
        task
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const {
        completed,
        priority,
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters: any = { userId };

      if (completed !== undefined) {
        filters.completed = completed === 'true';
      }

      if (priority) {
        filters.priority = priority;
      }

      const tasks = await Task.findByFilters(filters, {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      res.json({
        tasks: tasks.items,
        pagination: {
          page: tasks.page,
          limit: tasks.limit,
          total: tasks.total,
          totalPages: tasks.totalPages
        }
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTaskById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { taskId } = req.params;

      const task = await Task.findById(taskId);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      // Check if user owns the task or has access to it
      if (task.userId !== userId && !task.sharedWith?.includes(userId)) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      res.json({ task });
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { taskId } = req.params;
      const { title, description, priority, completed } = req.body;

      const task = await Task.findById(taskId);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      // Check if user owns the task or has write access
      if (task.userId !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const updateData: any = {};

      if (title !== undefined) {
        if (!title.trim()) {
          res.status(400).json({ error: 'Task title cannot be empty' });
          return;
        }
        updateData.title = title.trim();
      }

      if (description !== undefined) {
        updateData.description = description.trim();
      }

      if (priority !== undefined) {
        if (!['low', 'medium', 'high'].includes(priority)) {
          res.status(400).json({ error: 'Invalid priority value' });
          return;
        }
        updateData.priority = priority;
      }

      if (completed !== undefined) {
        updateData.completed = Boolean(completed);
      }

      const updatedTask = await Task.updateById(taskId, updateData);

      res.json({
        message: 'Task updated successfully',
        task: updatedTask
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { taskId } = req.params;

      const task = await Task.findById(taskId);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      if (task.userId !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const deleted = await Task.deleteById(taskId);

      if (!deleted) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async shareTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { taskId } = req.params;
      const { userIds, permission } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ error: 'User IDs are required' });
        return;
      }

      const task = await Task.findById(taskId);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      if (task.userId !== userId) {
        res.status(403).json({ error: 'Only task owner can share tasks' });
        return;
      }

      const updatedTask = await Task.shareWithUsers(taskId, userIds, permission);

      res.json({
        message: 'Task shared successfully',
        task: updatedTask
      });
    } catch (error) {
      console.error('Share task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}`
    };

    const taskModel = {
      path: 'src/models/Task.ts',
      type: 'schema' as const,
      content: `export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  userId: string;
  sharedWith?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  userId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}

export interface TaskFilters {
  userId?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  sharedWith?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Mock database - replace with actual database implementation
class TaskModel {
  private tasks: Task[] = [];
  private nextId = 1;

  async create(taskData: CreateTaskData): Promise<Task> {
    const task: Task = {
      id: this.nextId.toString(),
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      userId: taskData.userId,
      sharedWith: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.push(task);
    this.nextId++;

    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const task = this.tasks.find(t => t.id === id);
    return task || null;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return this.tasks.filter(t =>
      t.userId === userId || t.sharedWith?.includes(userId)
    );
  }

  async findByFilters(
    filters: TaskFilters,
    options: PaginationOptions
  ): Promise<PaginatedResult<Task>> {
    let filteredTasks = this.tasks.filter(task => {
      if (filters.userId && task.userId !== filters.userId && !task.sharedWith?.includes(filters.userId)) {
        return false;
      }

      if (filters.completed !== undefined && task.completed !== filters.completed) {
        return false;
      }

      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      return true;
    });

    // Sort tasks
    filteredTasks.sort((a, b) => {
      const aValue = (a as any)[options.sortBy];
      const bValue = (b as any)[options.sortBy];

      if (options.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const total = filteredTasks.length;
    const totalPages = Math.ceil(total / options.limit);
    const startIndex = (options.page - 1) * options.limit;
    const endIndex = startIndex + options.limit;
    const items = filteredTasks.slice(startIndex, endIndex);

    return {
      items,
      page: options.page,
      limit: options.limit,
      total,
      totalPages
    };
  }

  async updateById(id: string, updateData: UpdateTaskData): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return null;
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return this.tasks[taskIndex];
  }

  async deleteById(id: string): Promise<boolean> {
    const taskIndex = this.tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  async shareWithUsers(taskId: string, userIds: string[], permission: 'read' | 'write'): Promise<Task | null> {
    const task = await this.findById(taskId);

    if (!task) {
      return null;
    }

    const currentSharedWith = task.sharedWith || [];
    const newSharedWith = [...new Set([...currentSharedWith, ...userIds])];

    return this.updateById(taskId, { sharedWith: newSharedWith } as UpdateTaskData);
  }
}

export const Task = new TaskModel();`
    };

    return [taskController, taskModel];
  }

  private generateSharingBackend(task: TechnicalTask): GeneratedFile[] {
    const sharingController = {
      path: 'src/controllers/SharingController.ts',
      type: 'api' as const,
      content: `import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export class SharingController {
  async shareTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { taskId } = req.params;
      const { userEmails, permission = 'read' } = req.body;

      if (!userEmails || !Array.isArray(userEmails) || userEmails.length === 0) {
        res.status(400).json({ error: 'User emails are required' });
        return;
      }

      const task = await Task.findById(taskId);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      if (task.userId !== userId) {
        res.status(403).json({ error: 'Only task owner can share tasks' });
        return;
      }

      // Find users by email
      const users = [];
      for (const email of userEmails) {
        const user = await User.findByEmail(email);
        if (user) {
          users.push(user);
        }
      }

      if (users.length === 0) {
        res.status(404).json({ error: 'No valid users found' });
        return;
      }

      const userIds = users.map(u => u.id);
      const updatedTask = await Task.shareWithUsers(taskId, userIds, permission);

      res.json({
        message: \`Task shared with \${users.length} user(s)\`,
        task: updatedTask,
        sharedWith: users.map(u => ({ id: u.id, name: u.name, email: u.email }))
      });
    } catch (error) {
      console.error('Share task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async unshareTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { taskId } = req.params;
      const { userIds } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ error: 'User IDs are required' });
        return;
      }

      const task = await Task.findById(taskId);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      if (task.userId !== userId) {
        res.status(403).json({ error: 'Only task owner can unshare tasks' });
        return;
      }

      const currentSharedWith = task.sharedWith || [];
      const newSharedWith = currentSharedWith.filter(id => !userIds.includes(id));

      const updatedTask = await Task.updateById(taskId, {
        sharedWith: newSharedWith
      } as any);

      res.json({
        message: 'Task unshared successfully',
        task: updatedTask
      });
    } catch (error) {
      console.error('Unshare task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSharedTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      const tasks = await Task.findByFilters(
        { sharedWith: userId },
        {
          page: 1,
          limit: 100,
          sortBy: 'updatedAt',
          sortOrder: 'desc'
        }
      );

      res.json({
        tasks: tasks.items
      });
    } catch (error) {
      console.error('Get shared tasks error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTaskCollaborators(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { taskId } = req.params;

      const task = await Task.findById(taskId);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      // Check if user has access to the task
      if (task.userId !== userId && !task.sharedWith?.includes(userId)) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const collaborators = [];

      // Add task owner
      const owner = await User.findById(task.userId);
      if (owner) {
        collaborators.push({
          id: owner.id,
          name: owner.name,
          email: owner.email,
          role: 'owner'
        });
      }

      // Add shared users
      if (task.sharedWith) {
        for (const sharedUserId of task.sharedWith) {
          const user = await User.findById(sharedUserId);
          if (user) {
            collaborators.push({
              id: user.id,
              name: user.name,
              email: user.email,
              role: 'collaborator'
            });
          }
        }
      }

      res.json({ collaborators });
    } catch (error) {
      console.error('Get task collaborators error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { query } = req.query;

      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        res.status(400).json({ error: 'Search query must be at least 2 characters' });
        return;
      }

      const searchTerm = query.trim().toLowerCase();
      const allUsers = await User.findAll();

      const matchingUsers = allUsers
        .filter(user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        )
        .slice(0, 10) // Limit to 10 results
        .map(user => ({
          id: user.id,
          name: user.name,
          email: user.email
        }));

      res.json({ users: matchingUsers });
    } catch (error) {
      console.error('Search users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}`
    };

    return [sharingController];
  }

  private generateAPIFoundation(task: TechnicalTask): GeneratedFile[] {
    const serverSetup = {
      path: 'src/server.ts',
      type: 'api' as const,
      content: `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/authRoutes';
import { taskRoutes } from './routes/taskRoutes';
import { sharingRoutes } from './routes/sharingRoutes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sharing', sharingRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`Environment: \${process.env.NODE_ENV || 'development'}\`);
});

export default app;`
    };

    const authRoutes = {
      path: 'src/routes/authRoutes.ts',
      type: 'api' as const,
      content: `import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));
router.put('/profile', authenticateToken, authController.updateProfile.bind(authController));

export { router as authRoutes };`
    };

    const taskRoutes = {
      path: 'src/routes/taskRoutes.ts',
      type: 'api' as const,
      content: `import express from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const taskController = new TaskController();

// All task routes require authentication
router.use(authenticateToken);

router.post('/', taskController.createTask.bind(taskController));
router.get('/', taskController.getTasks.bind(taskController));
router.get('/:taskId', taskController.getTaskById.bind(taskController));
router.put('/:taskId', taskController.updateTask.bind(taskController));
router.delete('/:taskId', taskController.deleteTask.bind(taskController));
router.post('/:taskId/share', taskController.shareTask.bind(taskController));

export { router as taskRoutes };`
    };

    const sharingRoutes = {
      path: 'src/routes/sharingRoutes.ts',
      type: 'api' as const,
      content: `import express from 'express';
import { SharingController } from '../controllers/SharingController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const sharingController = new SharingController();

// All sharing routes require authentication
router.use(authenticateToken);

router.post('/tasks/:taskId/share', sharingController.shareTask.bind(sharingController));
router.post('/tasks/:taskId/unshare', sharingController.unshareTask.bind(sharingController));
router.get('/tasks/shared', sharingController.getSharedTasks.bind(sharingController));
router.get('/tasks/:taskId/collaborators', sharingController.getTaskCollaborators.bind(sharingController));
router.get('/users/search', sharingController.searchUsers.bind(sharingController));

export { router as sharingRoutes };`
    };

    const errorHandler = {
      path: 'src/middleware/errorHandler.ts',
      type: 'other' as const,
      content: `import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    error: message,
    code: err.code,
    timestamp: new Date().toISOString()
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};`
    };

    const requestLogger = {
      path: 'src/middleware/requestLogger.ts',
      type: 'other' as const,
      content: `import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  // Log request
  console.log(\`\${new Date().toISOString()} \${req.method} \${req.path}\`);

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk?: any) {
    const duration = Date.now() - start;
    console.log(
      \`\${new Date().toISOString()} \${req.method} \${req.path} \${res.statusCode} - \${duration}ms\`
    );

    originalEnd.call(this, chunk);
  };

  next();
};`
    };

    return [serverSetup, authRoutes, taskRoutes, sharingRoutes, errorHandler, requestLogger];
  }

  private generateDatabaseSchema(task: TechnicalTask): GeneratedFile[] {
    const databaseConfig = {
      path: 'src/config/database.ts',
      type: 'config' as const,
      content: `// Database configuration
// This is a mock implementation - replace with actual database setup

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'task_management',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production'
  };
};

// Example SQL schema for PostgreSQL
export const SQL_SCHEMA = \`
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task sharing table
CREATE TABLE IF NOT EXISTS task_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(20) DEFAULT 'read' CHECK (permission IN ('read', 'write')),
  shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(task_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_task_shares_task_id ON task_shares(task_id);
CREATE INDEX IF NOT EXISTS idx_task_shares_user_id ON task_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\`;`
    };

    const packageJson = {
      path: 'package.json',
      type: 'config' as const,
      content: `{
  "name": "ai-agent-task-manager",
  "version": "1.0.0",
  "description": "AI Agent system for translating project briefs into technical tasks",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node src/server.ts",
    "dev:watch": "nodemon --exec ts-node src/server.ts",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.0",
    "mongoose": "^7.4.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/pg": "^8.10.2",
    "@types/node": "^20.4.5",
    "typescript": "^5.1.6",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1",
    "jest": "^29.6.1",
    "@types/jest": "^29.5.3",
    "eslint": "^8.45.0",
    "@typescript-eslint/eslint-plugin": "^6.2.0",
    "@typescript-eslint/parser": "^6.2.0"
  },
  "author": "",
  "license": "MIT",
  "keywords": [
    "ai",
    "agent",
    "task-management",
    "nodejs",
    "typescript",
    "express"
  ]
}`
    };

    const envExample = {
      path: '.env.example',
      type: 'config' as const,
      content: `# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=password

# Database Configuration (MongoDB alternative)
MONGODB_URI=mongodb://localhost:27017/task_management

# Other Configuration
API_VERSION=v1
MAX_REQUEST_SIZE=10mb
CORS_ORIGIN=http://localhost:3000`
    };

    return [databaseConfig, packageJson, envExample];
  }

  private generateTaskOutput(task: TechnicalTask, files: GeneratedFile[]): string {
    let output = `Backend Agent - Task Completed: ${task.title}\n\n`;
    output += `Generated ${files.length} files:\n`;

    files.forEach(file => {
      output += `- ${file.path} (${file.type})\n`;
    });

    output += `\nBackend implementation includes:\n`;
    output += `- RESTful API endpoints with proper HTTP methods\n`;
    output += `- Authentication and authorization middleware\n`;
    output += `- Input validation and error handling\n`;
    output += `- Database models with relationships\n`;
    output += `- Security best practices (password hashing, JWT tokens)\n`;
    output += `- Request logging and monitoring\n`;
    output += `- Scalable architecture with separation of concerns\n`;

    return output;
  }
}