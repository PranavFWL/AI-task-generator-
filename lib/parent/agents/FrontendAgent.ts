import { BaseAgent } from './BaseAgent';
import { TechnicalTask, AgentResponse, GeneratedFile } from '../types';

export class FrontendAgent extends BaseAgent {
  constructor() {
    super('Frontend Agent', ['frontend', 'react', 'ui_components']);
  }

  async executeTask(task: TechnicalTask): Promise<AgentResponse> {
    if (!this.validateTask(task) || task.type !== 'frontend') {
      return {
        success: false,
        output: '',
        error: 'Invalid frontend task'
      };
    }

    try {
      const files = await this.generateReactComponents(task);
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
        error: error instanceof Error ? error.message : 'Frontend generation failed'
      };
    }
  }

  private async generateReactComponents(task: TechnicalTask): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    const taskTitle = task.title.toLowerCase();

    if (taskTitle.includes('auth') || taskTitle.includes('login')) {
      files.push(...this.generateAuthComponents(task));
    }

    if (taskTitle.includes('task') || taskTitle.includes('todo')) {
      files.push(...this.generateTaskComponents(task));
    }

    if (taskTitle.includes('shar')) {
      files.push(...this.generateSharingComponents(task));
    }

    return files;
  }

  private generateAuthComponents(task: TechnicalTask): GeneratedFile[] {
    const loginComponent = {
      path: 'src/components/auth/LoginForm.tsx',
      type: 'component' as const,
      content: `import React, { useState } from 'react';
import './AuthForm.css';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onLogin(email, password);
      } catch (error) {
        setErrors({ email: 'Login failed. Please check your credentials.' });
      }
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};`
    };

    const registerComponent = {
      path: 'src/components/auth/RegisterForm.tsx',
      type: 'component' as const,
      content: `import React, { useState } from 'react';
import './AuthForm.css';

interface RegisterFormProps {
  onRegister: (email: string, password: string, name: string) => Promise<void>;
  isLoading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onRegister(email, password, name);
      } catch (error) {
        setErrors({ email: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
};`
    };

    const authStyles = {
      path: 'src/components/auth/AuthForm.css',
      type: 'other' as const,
      content: `.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .auth-form-container {
    padding: 1rem;
  }

  .auth-form {
    padding: 1.5rem;
  }
}`
    };

    return [loginComponent, registerComponent, authStyles];
  }

  private generateTaskComponents(task: TechnicalTask): GeneratedFile[] {
    const taskListComponent = {
      path: 'src/components/tasks/TaskList.tsx',
      type: 'component' as const,
      content: `import React from 'react';
import { Task } from '../../types/Task';
import { TaskItem } from './TaskItem';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  isLoading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  isLoading = false
}) => {
  if (isLoading) {
    return <div className="task-list-loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Your Tasks</h2>
      <div className="task-list-container">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};`
    };

    const taskItemComponent = {
      path: 'src/components/tasks/TaskItem.tsx',
      type: 'component' as const,
      content: `import React, { useState } from 'react';
import { Task } from '../../types/Task';
import './TaskList.css';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const toggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  return (
    <div className={\`task-item \${task.completed ? 'completed' : ''}\`}>
      <div className="task-item-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleComplete}
          className="task-checkbox"
        />

        {isEditing ? (
          <div className="task-edit-form">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="task-edit-title"
              placeholder="Task title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="task-edit-description"
              placeholder="Task description (optional)"
              rows={2}
            />
            <div className="task-edit-actions">
              <button onClick={handleSave} className="btn btn-save">Save</button>
              <button onClick={handleCancel} className="btn btn-cancel">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="task-content">
            <h3 className="task-title">{task.title}</h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
              <span className="task-priority priority-\${task.priority || 'medium'}">
                {task.priority || 'medium'}
              </span>
              <span className="task-date">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="task-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-edit"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-delete"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};`
    };

    const taskFormComponent = {
      path: 'src/components/tasks/TaskForm.tsx',
      type: 'component' as const,
      content: `import React, { useState } from 'react';
import { Task } from '../../types/Task';
import './TaskList.css';

interface TaskFormProps {
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onCreateTask, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      completed: false
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="task-title-input"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)..."
          className="task-description-input"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="task-priority-select"
          disabled={isLoading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading || !title.trim()} className="btn btn-create">
        {isLoading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};`
    };

    const taskStyles = {
      path: 'src/components/tasks/TaskList.css',
      type: 'other' as const,
      content: `.task-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.task-list h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.task-list-loading,
.task-list-empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.task-list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.task-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-item.completed {
  opacity: 0.7;
  background-color: #f8f9fa;
}

.task-item-main {
  display: flex;
  align-items: flex-start;
  flex: 1;
  gap: 1rem;
}

.task-checkbox {
  margin-top: 0.25rem;
  transform: scale(1.2);
}

.task-content {
  flex: 1;
}

.task-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #666;
}

.task-description {
  margin: 0 0 0.75rem 0;
  color: #666;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.task-priority {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.priority-low {
  background-color: #d4edda;
  color: #155724;
}

.priority-medium {
  background-color: #fff3cd;
  color: #856404;
}

.priority-high {
  background-color: #f8d7da;
  color: #721c24;
}

.task-date {
  color: #888;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.btn-edit,
.btn-delete {
  background: none;
  border: 1px solid #ddd;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
}

.btn-edit:hover {
  background-color: #f8f9fa;
}

.btn-delete:hover {
  background-color: #fee;
}

.task-edit-form {
  flex: 1;
}

.task-edit-title,
.task-edit-description {
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.task-edit-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.task-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.task-title-input,
.task-description-input,
.task-priority-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.task-priority-select {
  width: auto;
  min-width: 120px;
}

.btn-create {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-create:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-create:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .task-item {
    flex-direction: column;
    gap: 1rem;
  }

  .task-actions {
    align-self: flex-end;
  }

  .task-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}`
    };

    const taskTypes = {
      path: 'src/types/Task.ts',
      type: 'other' as const,
      content: `export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  userId?: string;
  sharedWith?: string[];
}`
    };

    return [taskListComponent, taskItemComponent, taskFormComponent, taskStyles, taskTypes];
  }

  private generateSharingComponents(task: TechnicalTask): GeneratedFile[] {
    const shareModal = {
      path: 'src/components/sharing/ShareTaskModal.tsx',
      type: 'component' as const,
      content: `import React, { useState } from 'react';
import './ShareModal.css';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (userIds: string[], permission: 'read' | 'write') => void;
  users: User[];
  isLoading?: boolean;
}

export const ShareTaskModal: React.FC<ShareTaskModalProps> = ({
  isOpen,
  onClose,
  onShare,
  users,
  isLoading = false
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [permission, setPermission] = useState<'read' | 'write'>('read');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleShare = () => {
    if (selectedUsers.length > 0) {
      onShare(selectedUsers, permission);
      setSelectedUsers([]);
      setSearchTerm('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Share Task</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="user-search"
            />
          </div>

          <div className="users-list">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-item">
                <label className="user-label">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                  />
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div className="permission-section">
            <label>Permission Level:</label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as 'read' | 'write')}
              className="permission-select"
            >
              <option value="read">Read Only</option>
              <option value="write">Read & Write</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-cancel">
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={selectedUsers.length === 0 || isLoading}
            className="btn btn-share"
          >
            {isLoading ? 'Sharing...' : \`Share with \${selectedUsers.length} user(s)\`}
          </button>
        </div>
      </div>
    </div>
  );
};`
    };

    const shareStyles = {
      path: 'src/components/sharing/ShareModal.css',
      type: 'other' as const,
      content: `.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
}

.search-section {
  margin-bottom: 1rem;
}

.user-search {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.users-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.user-item {
  border-bottom: 1px solid #f5f5f5;
}

.user-item:last-child {
  border-bottom: none;
}

.user-label {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-label:hover {
  background-color: #f8f9fa;
}

.user-label input {
  margin-right: 0.75rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.user-email {
  font-size: 0.875rem;
  color: #666;
}

.permission-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.permission-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-share {
  background-color: #007bff;
  color: white;
}

.btn-share:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .permission-section {
    flex-direction: column;
    align-items: flex-start;
  }
}`
    };

    return [shareModal, shareStyles];
  }

  private generateTaskOutput(task: TechnicalTask, files: GeneratedFile[]): string {
    let output = `Frontend Agent - Task Completed: ${task.title}\n\n`;
    output += `Generated ${files.length} files:\n`;

    files.forEach(file => {
      output += `- ${file.path} (${file.type})\n`;
    });

    output += `\nAll components are responsive and include:\n`;
    output += `- Form validation and error handling\n`;
    output += `- Loading states\n`;
    output += `- Accessibility features\n`;
    output += `- CSS styling with responsive design\n`;
    output += `- TypeScript interfaces for type safety\n`;

    return output;
  }
}