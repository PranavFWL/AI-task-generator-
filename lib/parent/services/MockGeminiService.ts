// Mock Gemini Service for when dependencies are not available
import { ProjectBrief, TechnicalTask } from '../types';

export class MockGeminiService {
  private isConnected: boolean = false;

  constructor() {
    // Check if we have the API key
    this.isConnected = !!process.env.GEMINI_API_KEY;
    console.log(`[Fallback] Mock Gemini Service initialized (API Key: ${this.isConnected ? 'Present' : 'Missing'})`);
  }

  async analyzeProjectBrief(brief: ProjectBrief): Promise<TechnicalTask[]> {
    console.log('[AI] Mock AI analyzing project brief...');

    // Simulate AI processing time
    await this.delay(1000);

    // Enhanced rule-based analysis that mimics AI behavior
    const tasks = this.generateEnhancedTasks(brief);

    console.log(`[Success] Mock AI generated ${tasks.length} enhanced technical tasks`);
    return tasks;
  }

  async generateCode(task: TechnicalTask, agentType: 'frontend' | 'backend'): Promise<{
    files: Array<{path: string, content: string, type: string}>,
    explanation: string
  }> {
    console.log(`[Frontend] Mock AI generating ${agentType} code...`);

    // Simulate AI processing time
    await this.delay(800);

    if (agentType === 'frontend') {
      return this.generateMockFrontendCode(task);
    } else {
      return this.generateMockBackendCode(task);
    }
  }

  async enhanceTaskDescription(task: TechnicalTask): Promise<TechnicalTask> {
    // Simulate AI processing time
    await this.delay(300);

    // Enhanced task with more details
    return {
      ...task,
      description: `${task.description} - Enhanced with comprehensive requirements and modern best practices`,
      acceptance_criteria: [
        ...task.acceptance_criteria,
        'Comprehensive error handling and validation',
        'Security best practices implementation',
        'Performance optimization considerations',
        'Accessibility compliance (WCAG 2.1)',
        'Mobile-responsive design patterns',
        'Comprehensive testing coverage'
      ],
      estimatedHours: this.calculateEstimatedHours(task)
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateEnhancedTasks(brief: ProjectBrief): TechnicalTask[] {
    const tasks: TechnicalTask[] = [];
    const description = brief.description.toLowerCase();

    // Enhanced authentication system
    if (description.includes('auth') || description.includes('login') || description.includes('user')) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Implement Advanced Authentication System',
        description: 'Create a comprehensive authentication system with modern security practices, multi-factor authentication, and social login integration',
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'User registration with email verification',
          'Secure login with password hashing (bcrypt)',
          'JWT token-based authentication',
          'Password reset functionality',
          'Multi-factor authentication (TOTP)',
          'Social login integration (Google, GitHub)',
          'Rate limiting for security',
          'Session management with refresh tokens',
          'Account lockout after failed attempts',
          'Audit logging for security events'
        ],
        estimatedHours: 16
      });

      tasks.push({
        id: this.generateTaskId(),
        title: 'Build Modern Authentication UI Components',
        description: 'Create responsive, accessible authentication forms with advanced UX patterns and real-time validation',
        type: 'frontend',
        priority: 'high',
        acceptance_criteria: [
          'Responsive login/register forms',
          'Real-time form validation',
          'Password strength indicator',
          'Social login buttons',
          'Multi-factor authentication UI',
          'Password recovery flow',
          'Loading states and error handling',
          'Accessibility compliance (ARIA labels)',
          'Mobile-optimized design',
          'Dark/light theme support'
        ],
        estimatedHours: 12
      });
    }

    // Enhanced task management
    if (description.includes('task') || description.includes('todo') || description.includes('management')) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Develop Comprehensive Task Management API',
        description: 'Build a scalable task management system with advanced features like categories, priorities, and collaboration',
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'CRUD operations for tasks',
          'Task categorization and tagging',
          'Priority levels and due dates',
          'Task dependencies and subtasks',
          'Advanced filtering and search',
          'Bulk operations support',
          'Real-time notifications',
          'Activity history and audit trail',
          'Data export functionality',
          'Performance optimization with indexing'
        ],
        estimatedHours: 20
      });

      tasks.push({
        id: this.generateTaskId(),
        title: 'Create Interactive Task Management Dashboard',
        description: 'Build a modern, interactive dashboard with drag-and-drop functionality and real-time updates',
        type: 'frontend',
        priority: 'high',
        acceptance_criteria: [
          'Kanban board with drag-and-drop',
          'Task creation and editing modals',
          'Advanced filtering and search',
          'Real-time updates via WebSocket',
          'Bulk selection and operations',
          'Calendar view integration',
          'Progress tracking and analytics',
          'Keyboard shortcuts support',
          'Responsive design for all devices',
          'Customizable dashboard layout'
        ],
        estimatedHours: 18
      });
    }

    // Enhanced sharing and collaboration
    if (description.includes('shar') || description.includes('collaborat') || description.includes('team')) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Implement Advanced Collaboration System',
        description: 'Create a comprehensive collaboration platform with real-time features and permission management',
        type: 'backend',
        priority: 'medium',
        acceptance_criteria: [
          'Team and workspace management',
          'Granular permission system',
          'Real-time collaboration features',
          'Comment and mention system',
          'File sharing and attachments',
          'Activity feeds and notifications',
          'Integration with external tools',
          'Conflict resolution mechanisms',
          'Version control for shared items',
          'Advanced analytics and reporting'
        ],
        estimatedHours: 24
      });

      tasks.push({
        id: this.generateTaskId(),
        title: 'Build Collaborative User Interface',
        description: 'Design and implement real-time collaborative features with modern UX patterns',
        type: 'frontend',
        priority: 'medium',
        acceptance_criteria: [
          'Real-time collaborative editing',
          'User presence indicators',
          'Comment and annotation system',
          'File upload with drag-and-drop',
          'Team member management UI',
          'Permission settings interface',
          'Activity timeline and feeds',
          'Notification center',
          'Integration widgets',
          'Mobile collaboration features'
        ],
        estimatedHours: 16
      });
    }

    // Enhanced e-commerce features
    if (description.includes('ecommerce') || description.includes('shop') || description.includes('product')) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Build Advanced E-commerce Backend',
        description: 'Create a comprehensive e-commerce system with inventory, orders, and payment processing',
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'Product catalog with variants',
          'Inventory management system',
          'Shopping cart and checkout',
          'Order processing workflow',
          'Payment gateway integration',
          'Shipping and tax calculations',
          'Customer management system',
          'Analytics and reporting',
          'Promotional codes and discounts',
          'Multi-currency support'
        ],
        estimatedHours: 32
      });

      tasks.push({
        id: this.generateTaskId(),
        title: 'Create Modern E-commerce Frontend',
        description: 'Build a responsive, fast-loading e-commerce interface with advanced shopping features',
        type: 'frontend',
        priority: 'high',
        acceptance_criteria: [
          'Product catalog with filtering',
          'Advanced search functionality',
          'Shopping cart with persistence',
          'Checkout flow optimization',
          'Product image gallery',
          'Customer account dashboard',
          'Order tracking interface',
          'Responsive design patterns',
          'Performance optimization',
          'SEO-friendly structure'
        ],
        estimatedHours: 28
      });
    }

    // Add API foundation if not already present
    if (tasks.length > 0 && !tasks.some(t => t.title.toLowerCase().includes('api') || t.title.toLowerCase().includes('foundation'))) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Setup Production-Ready API Infrastructure',
        description: 'Establish robust API foundation with security, monitoring, and scalability features',
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'Express.js server with TypeScript',
          'Comprehensive middleware setup',
          'Security headers and CORS',
          'Request/response logging',
          'Error handling middleware',
          'API documentation (OpenAPI/Swagger)',
          'Health check endpoints',
          'Rate limiting and throttling',
          'Environment configuration',
          'Docker containerization'
        ],
        estimatedHours: 12
      });
    }

    // FALLBACK: If no tasks generated, create generic project structure
    if (tasks.length === 0) {
      console.log('[Warning] No keywords matched, generating comprehensive project tasks...');

      // Task 1: Database & Backend Architecture
      tasks.push({
        id: this.generateTaskId(),
        title: 'Design Database Schema and Backend Architecture',
        description: `Build a scalable, secure backend foundation for the project. This includes:

- Design normalized database schema with proper relationships and indexes
- Set up database migrations and seeders for development
- Create data models with validation rules
- Implement database connection pooling and optimization
- Design RESTful API architecture with versioning
- Set up proper error handling and logging mechanisms
- Configure environment-based settings (development, staging, production)
- Implement health check and monitoring endpoints`,
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'Complete database schema diagram created',
          'All data models implemented with proper relationships',
          'Database migrations tested and documented',
          'API endpoints follow RESTful conventions',
          'Environment configuration properly set up',
          'Database queries optimized with proper indexing',
          'Error handling middleware implemented',
          'API documentation generated (Swagger/OpenAPI)'
        ],
        estimatedHours: 20
      });

      // Task 2: Authentication & Authorization
      tasks.push({
        id: this.generateTaskId(),
        title: 'Implement User Authentication and Authorization System',
        description: `Create a secure, production-ready authentication system. This includes:

- User registration with email/phone verification
- Secure login with password hashing (bcrypt/argon2)
- JWT token-based authentication with refresh tokens
- Password reset and account recovery flow
- Role-based access control (RBAC) system
- Session management and token expiration handling
- Account security features (2FA support, login history)
- OAuth integration for social login (Google, GitHub, etc.)`,
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'User registration with email verification working',
          'Secure login system with proper password hashing',
          'JWT tokens generated and validated correctly',
          'Password reset flow fully functional',
          'Role-based permissions implemented',
          'Refresh token mechanism working',
          'Security best practices followed (rate limiting, etc.)',
          'Social login integration completed'
        ],
        estimatedHours: 18
      });

      // Task 3: Core Business Logic
      tasks.push({
        id: this.generateTaskId(),
        title: 'Develop Core Business Logic and API Endpoints',
        description: `Implement the main functionality and business rules for the application. This includes:

- Create CRUD operations for all main entities
- Implement business validation rules and workflows
- Build complex query and filtering capabilities
- Add pagination, sorting, and search functionality
- Implement data relationships and cascading operations
- Create bulk operations for efficiency
- Add data export and import features
- Implement audit trails and activity logging`,
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'All CRUD operations working correctly',
          'Business validation rules enforced',
          'Advanced filtering and search implemented',
          'Pagination working on all list endpoints',
          'Data relationships properly handled',
          'Bulk operations tested and optimized',
          'Export functionality working (CSV, PDF, etc.)',
          'Activity logs captured for important actions'
        ],
        estimatedHours: 28
      });

      // Task 4: Frontend Components & UI
      tasks.push({
        id: this.generateTaskId(),
        title: 'Build Responsive UI Components and Layout System',
        description: `Create a modern, accessible, and responsive user interface. This includes:

- Design and implement reusable component library
- Build responsive layout system (mobile, tablet, desktop)
- Create navigation system (header, sidebar, breadcrumbs)
- Implement form components with validation
- Build data display components (tables, cards, lists)
- Add loading states, skeletons, and empty states
- Implement modal, drawer, and notification systems
- Ensure accessibility compliance (WCAG 2.1 AA)`,
        type: 'frontend',
        priority: 'high',
        acceptance_criteria: [
          'Component library with 20+ reusable components',
          'Fully responsive design for all screen sizes',
          'Navigation system working smoothly',
          'Forms with real-time validation implemented',
          'Data tables with sorting and filtering',
          'Loading and error states properly displayed',
          'Modal and notification systems functional',
          'Accessibility audit passed with no critical issues'
        ],
        estimatedHours: 24
      });

      // Task 5: State Management & API Integration
      tasks.push({
        id: this.generateTaskId(),
        title: 'Implement State Management and API Integration Layer',
        description: `Set up efficient state management and connect frontend to backend APIs. This includes:

- Configure global state management (Redux/Zustand/Context)
- Create API client with interceptors and error handling
- Implement data caching and optimistic updates
- Set up request/response transformations
- Add loading and error state management
- Implement retry logic and offline support
- Create hooks for data fetching and mutations
- Add WebSocket support for real-time features (if needed)`,
        type: 'frontend',
        priority: 'high',
        acceptance_criteria: [
          'State management system properly configured',
          'All API endpoints integrated',
          'Loading states displayed during API calls',
          'Error messages shown appropriately',
          'Data caching working to reduce API calls',
          'Optimistic updates implemented where needed',
          'Custom hooks created for common operations',
          'Real-time updates working (if applicable)'
        ],
        estimatedHours: 16
      });

      // Task 6: Testing & Quality Assurance
      tasks.push({
        id: this.generateTaskId(),
        title: 'Implement Comprehensive Testing Suite',
        description: `Create automated tests to ensure code quality and reliability. This includes:

- Set up testing framework and test environment
- Write unit tests for business logic and utilities
- Create integration tests for API endpoints
- Implement component tests for UI elements
- Add end-to-end tests for critical user flows
- Set up test coverage reporting (aim for 80%+)
- Implement continuous testing in CI/CD pipeline
- Create testing documentation and guidelines`,
        type: 'backend',
        priority: 'medium',
        acceptance_criteria: [
          'Testing framework configured (Jest, Vitest, etc.)',
          'Unit tests covering core business logic',
          'Integration tests for all API endpoints',
          'Component tests for major UI components',
          'E2E tests for main user workflows',
          'Test coverage above 80%',
          'Tests running automatically in CI/CD',
          'Testing documentation completed'
        ],
        estimatedHours: 20
      });

      // Task 7: Security & Performance Optimization
      tasks.push({
        id: this.generateTaskId(),
        title: 'Implement Security Measures and Performance Optimization',
        description: `Ensure the application is secure and performs efficiently. This includes:

- Implement input validation and sanitization
- Add rate limiting and DDoS protection
- Set up CORS policies and security headers
- Implement SQL injection and XSS prevention
- Add API request logging and monitoring
- Optimize database queries and add indexes
- Implement caching strategy (Redis/memory cache)
- Perform security audit and penetration testing`,
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'All user inputs validated and sanitized',
          'Rate limiting implemented on all endpoints',
          'Security headers properly configured',
          'No SQL injection or XSS vulnerabilities',
          'Request/response logging working',
          'Slow queries identified and optimized',
          'Caching implemented for frequently accessed data',
          'Security audit completed with no critical issues'
        ],
        estimatedHours: 16
      });

      // Task 8: Deployment & DevOps Setup
      tasks.push({
        id: this.generateTaskId(),
        title: 'Setup CI/CD Pipeline and Production Deployment',
        description: `Prepare the application for production deployment with automated workflows. This includes:

- Configure CI/CD pipeline (GitHub Actions/GitLab CI)
- Set up automated testing and code quality checks
- Create Docker containers for easy deployment
- Configure production environment variables
- Set up database backup and recovery procedures
- Implement application monitoring and alerting
- Configure auto-scaling and load balancing
- Create deployment documentation and runbooks`,
        type: 'backend',
        priority: 'medium',
        acceptance_criteria: [
          'CI/CD pipeline running successfully',
          'Automated tests passing before deployment',
          'Docker images built and pushed to registry',
          'Production environment properly configured',
          'Database backups scheduled and tested',
          'Monitoring dashboards set up',
          'Auto-scaling configured and tested',
          'Deployment documentation completed'
        ],
        estimatedHours: 14
      });
    }

    return tasks;
  }

  private generateMockFrontendCode(task: TechnicalTask): {
    files: Array<{path: string, content: string, type: string}>,
    explanation: string
  } {
    const files = [];

    if (task.title.toLowerCase().includes('auth')) {
      files.push({
        path: 'src/components/auth/EnhancedLoginForm.tsx',
        content: this.getEnhancedLoginComponent(),
        type: 'component'
      });

      files.push({
        path: 'src/components/auth/AuthForm.module.css',
        content: this.getModernAuthStyles(),
        type: 'other'
      });
    }

    if (task.title.toLowerCase().includes('dashboard') || task.title.toLowerCase().includes('task')) {
      files.push({
        path: 'src/components/dashboard/TaskDashboard.tsx',
        content: this.getAdvancedDashboardComponent(),
        type: 'component'
      });
    }

    return {
      files,
      explanation: `Mock AI generated modern, accessible React components with TypeScript, comprehensive error handling, and responsive design patterns. Components include advanced features like real-time validation, loading states, and accessibility compliance.`
    };
  }

  private generateMockBackendCode(task: TechnicalTask): {
    files: Array<{path: string, content: string, type: string}>,
    explanation: string
  } {
    const files = [];

    if (task.title.toLowerCase().includes('auth')) {
      files.push({
        path: 'src/controllers/EnhancedAuthController.ts',
        content: this.getEnhancedAuthController(),
        type: 'api'
      });

      files.push({
        path: 'src/middleware/advancedAuth.ts',
        content: this.getAdvancedAuthMiddleware(),
        type: 'other'
      });
    }

    if (task.title.toLowerCase().includes('task') || task.title.toLowerCase().includes('api')) {
      files.push({
        path: 'src/controllers/AdvancedTaskController.ts',
        content: this.getAdvancedTaskController(),
        type: 'api'
      });
    }

    return {
      files,
      explanation: `Mock AI generated production-ready Express.js controllers with comprehensive security features, input validation, error handling, and performance optimization. Includes rate limiting, audit logging, and modern authentication patterns.`
    };
  }

  private calculateEstimatedHours(task: TechnicalTask): number {
    const baseHours = task.type === 'backend' ? 12 : 8;
    const complexityMultiplier = task.priority === 'high' ? 1.5 : task.priority === 'medium' ? 1.2 : 1.0;
    const criteriaBonus = Math.min(task.acceptance_criteria.length * 0.5, 8);

    return Math.round(baseHours * complexityMultiplier + criteriaBonus);
  }

  private generateTaskId(): string {
    return `mock_ai_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getEnhancedLoginComponent(): string {
    return `import React, { useState, useCallback } from 'react';
import { AuthFormData, AuthError } from '../../types/auth';
import styles from './AuthForm.module.css';

interface EnhancedLoginFormProps {
  onLogin: (data: AuthFormData) => Promise<void>;
  onSocialLogin: (provider: 'google' | 'github') => Promise<void>;
  isLoading?: boolean;
  enableMFA?: boolean;
}

export const EnhancedLoginForm: React.FC<EnhancedLoginFormProps> = ({
  onLogin,
  onSocialLogin,
  isLoading = false,
  enableMFA = false
}) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    mfaCode: ''
  });
  const [errors, setErrors] = useState<AuthError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: AuthError = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (showMFA && !formData.mfaCode) {
      newErrors.mfaCode = 'MFA code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, showMFA, validateEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onLogin(formData);
    } catch (error: any) {
      if (error.code === 'MFA_REQUIRED') {
        setShowMFA(true);
      } else {
        setErrors({ general: error.message || 'Login failed' });
      }
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      await onSocialLogin(provider);
    } catch (error: any) {
      setErrors({ general: error.message || 'Social login failed' });
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
        <h2 className={styles.title}>Welcome Back</h2>

        {errors.general && (
          <div className={styles.errorAlert} role="alert">
            {errors.general}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={\`\${styles.input} \${errors.email ? styles.inputError : ''}\`}
            disabled={isLoading}
            autoComplete="email"
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          {errors.email && (
            <span id="email-error" className={styles.errorText} role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className={\`\${styles.input} \${errors.password ? styles.inputError : ''}\`}
              disabled={isLoading}
              autoComplete="current-password"
              aria-describedby={errors.password ? "password-error" : undefined}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <span id="password-error" className={styles.errorText} role="alert">
              {errors.password}
            </span>
          )}
        </div>

        {showMFA && (
          <div className={styles.formGroup}>
            <label htmlFor="mfaCode" className={styles.label}>
              Authentication Code
            </label>
            <input
              type="text"
              id="mfaCode"
              value={formData.mfaCode}
              onChange={(e) => setFormData(prev => ({ ...prev, mfaCode: e.target.value }))}
              className={\`\${styles.input} \${errors.mfaCode ? styles.inputError : ''}\`}
              disabled={isLoading}
              placeholder="Enter 6-digit code"
              maxLength={6}
              aria-describedby={errors.mfaCode ? "mfa-error" : undefined}
            />
            {errors.mfaCode && (
              <span id="mfa-error" className={styles.errorText} role="alert">
                {errors.mfaCode}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={\`\${styles.submitButton} \${isLoading ? styles.loading : ''}\`}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <div className={styles.socialButtons}>
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className={styles.socialButton}
            disabled={isLoading}
          >
            <span className={styles.socialIcon}>🔍</span>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            className={styles.socialButton}
            disabled={isLoading}
          >
            <span className={styles.socialIcon}>🐱</span>
            GitHub
          </button>
        </div>
      </form>
    </div>
  );
};`;
  }

  private getModernAuthStyles(): string {
    return `.authContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.authForm {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
}

.formGroup {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fafafa;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.inputError {
  border-color: #ef4444;
  background: #fef2f2;
}

.passwordContainer {
  position: relative;
}

.passwordToggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.passwordToggle:hover {
  background: #f3f4f6;
}

.errorText {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #ef4444;
}

.errorAlert {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.submitButton {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
}

.submitButton:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.submitButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading {
  position: relative;
}

.loading::after {
  content: '';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translateY(-50%) rotate(0deg); }
  100% { transform: translateY(-50%) rotate(360deg); }
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  color: #6b7280;
  font-size: 0.875rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 1rem;
}

.socialButtons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.socialButton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.socialButton:hover:not(:disabled) {
  border-color: #d1d5db;
  background: #f9fafb;
}

.socialIcon {
  font-size: 1.25rem;
}

@media (max-width: 480px) {
  .authContainer {
    padding: 0.5rem;
  }

  .authForm {
    padding: 2rem;
  }

  .socialButtons {
    grid-template-columns: 1fr;
  }
}`;
  }

  private getAdvancedDashboardComponent(): string {
    return `import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskFilter, TaskStats } from '../../types/task';

interface TaskDashboardProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const TaskDashboard: React.FC<TaskDashboardProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onCreateTask
}) => {
  const [filter, setFilter] = useState<TaskFilter>({
    status: 'all',
    priority: 'all',
    search: ''
  });
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar'>('kanban');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = filter.status === 'all' ||
        (filter.status === 'completed' && task.completed) ||
        (filter.status === 'pending' && !task.completed);

      const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;

      const matchesSearch = !filter.search ||
        task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filter.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, filter]);

  const taskStats = useMemo((): TaskStats => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      highPriority: tasks.filter(t => t.priority === 'high').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length
    };
  }, [tasks]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-number">{taskStats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{taskStats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{taskStats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card priority-high">
            <span className="stat-number">{taskStats.highPriority}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>
      </header>

      <div className="dashboard-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as any }))}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filter.priority}
            onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value as any }))}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="view-controls">
          <button
            onClick={() => setViewMode('list')}
            className={\`view-button \${viewMode === 'list' ? 'active' : ''}\`}
          >
            [Project] List
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={\`view-button \${viewMode === 'kanban' ? 'active' : ''}\`}
          >
            [Data] Kanban
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={\`view-button \${viewMode === 'calendar' ? 'active' : ''}\`}
          >
            📅 Calendar
          </button>
        </div>
      </div>

      <main className="dashboard-content">
        {viewMode === 'kanban' && (
          <KanbanView
            tasks={filteredTasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        )}
        {viewMode === 'list' && (
          <ListView
            tasks={filteredTasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        )}
        {viewMode === 'calendar' && (
          <CalendarView
            tasks={filteredTasks}
            onUpdateTask={onUpdateTask}
          />
        )}
      </main>
    </div>
  );
};`;
  }

  private getEnhancedAuthController(): string {
    return `import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User';
import { validateInput, validateEmail, validatePasswordStrength } from '../utils/validation';
import { config } from '../config/environment';
import { AuditLogger } from '../utils/auditLogger';

// Enhanced rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '15 minutes',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    AuditLogger.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path
    });
    res.status(429).json({
      error: 'Too many authentication attempts',
      retryAfter: '15 minutes',
      code: 'RATE_LIMITED'
    });
  }
});

export class EnhancedAuthController {
  /**
   * Enhanced user registration with comprehensive validation
   */
  async register(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    const { method, path, ip } = req;

    console.log(\`[\${new Date().toISOString()}] \${method} \${path} - IP: \${ip}\`);
    AuditLogger.logAuthAttempt('REGISTER_ATTEMPT', { ip, email: req.body.email });

    try {
      const { email, password, name, acceptTerms } = req.body;

      // Comprehensive input validation
      const validationErrors = validateInput(req.body, ['email', 'password', 'name']);
      if (validationErrors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationErrors,
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      // Email validation
      if (!validateEmail(email)) {
        res.status(400).json({
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        });
        return;
      }

      // Enhanced password validation
      if (!validatePasswordStrength(password)) {
        res.status(400).json({
          error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
          code: 'WEAK_PASSWORD'
        });
        return;
      }

      // Terms acceptance validation
      if (!acceptTerms) {
        res.status(400).json({
          error: 'You must accept the terms and conditions',
          code: 'TERMS_NOT_ACCEPTED'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email.toLowerCase().trim());
      if (existingUser) {
        AuditLogger.logSecurityEvent('DUPLICATE_REGISTRATION', { email, ip });
        res.status(409).json({
          error: 'User already exists with this email',
          code: 'USER_EXISTS'
        });
        return;
      }

      // Enhanced password hashing
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user with additional security fields
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        isVerified: false,
        mfaEnabled: false,
        lastLoginAt: null,
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        registrationIP: ip
      });

      // Generate verification token
      const verificationToken = this.generateVerificationToken(user.id);

      // Send verification email (implement email service)
      // await EmailService.sendVerificationEmail(user.email, verificationToken);

      // Generate JWT token (but require verification)
      const token = this.generateToken(user.id, { verified: false });

      AuditLogger.logAuthSuccess('USER_REGISTERED', {
        userId: user.id,
        email: user.email,
        ip
      });

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified
        },
        token,
        requiresVerification: true
      });

      const duration = Date.now() - startTime;
      console.log(\`[\${new Date().toISOString()}] Registration successful - Duration: \${duration}ms\`);

    } catch (error) {
      console.error('Registration error:', error);
      AuditLogger.logAuthFailure('REGISTER_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ip,
        email: req.body.email
      });

      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: config.nodeEnv === 'development' ?
          (error instanceof Error ? error.message : 'Unknown error') :
          'Registration failed'
      });
    }
  }

  /**
   * Enhanced login with security features
   */
  async login(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    const { method, path, ip } = req;

    console.log(\`[\${new Date().toISOString()}] \${method} \${path} - IP: \${ip}\`);
    AuditLogger.logAuthAttempt('LOGIN_ATTEMPT', { ip, email: req.body.email });

    try {
      const { email, password, mfaCode, rememberMe } = req.body;

      // Input validation
      const validationErrors = validateInput(req.body, ['email', 'password']);
      if (validationErrors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationErrors,
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      // Find user
      const user = await User.findByEmail(email.toLowerCase().trim());
      if (!user) {
        AuditLogger.logAuthFailure('LOGIN_USER_NOT_FOUND', { email, ip });
        // Use generic message to prevent user enumeration
        res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
        return;
      }

      // Check if account is locked
      if (user.accountLockedUntil && new Date(user.accountLockedUntil) > new Date()) {
        AuditLogger.logSecurityEvent('LOGIN_LOCKED_ACCOUNT', {
          userId: user.id,
          email,
          ip
        });
        res.status(423).json({
          error: 'Account is temporarily locked due to too many failed attempts',
          code: 'ACCOUNT_LOCKED',
          retryAfter: user.accountLockedUntil
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Increment failed attempts
        await User.incrementFailedAttempts(user.id);

        AuditLogger.logAuthFailure('LOGIN_INVALID_PASSWORD', {
          userId: user.id,
          email,
          ip
        });

        res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
        return;
      }

      // Check MFA if enabled
      if (user.mfaEnabled) {
        if (!mfaCode) {
          res.status(200).json({
            requiresMFA: true,
            message: 'Please provide MFA code',
            code: 'MFA_REQUIRED'
          });
          return;
        }

        const isMFAValid = await this.verifyMFACode(user.id, mfaCode);
        if (!isMFAValid) {
          AuditLogger.logAuthFailure('LOGIN_INVALID_MFA', {
            userId: user.id,
            email,
            ip
          });

          res.status(401).json({
            error: 'Invalid MFA code',
            code: 'INVALID_MFA'
          });
          return;
        }
      }

      // Reset failed attempts on successful login
      await User.resetFailedAttempts(user.id);

      // Update last login
      await User.updateLastLogin(user.id, ip);

      // Generate tokens
      const accessToken = this.generateToken(user.id, {
        verified: user.isVerified,
        mfa: user.mfaEnabled
      });

      const refreshToken = rememberMe ?
        this.generateRefreshToken(user.id) :
        null;

      AuditLogger.logAuthSuccess('USER_LOGIN', {
        userId: user.id,
        email: user.email,
        ip,
        mfaUsed: user.mfaEnabled
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          mfaEnabled: user.mfaEnabled
        },
        accessToken,
        refreshToken,
        expiresIn: '24h'
      });

      const duration = Date.now() - startTime;
      console.log(\`[\${new Date().toISOString()}] Login successful - Duration: \${duration}ms\`);

    } catch (error) {
      console.error('Login error:', error);
      AuditLogger.logAuthFailure('LOGIN_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ip,
        email: req.body.email
      });

      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: config.nodeEnv === 'development' ?
          (error instanceof Error ? error.message : 'Unknown error') :
          'Login failed'
      });
    }
  }

  private generateToken(userId: string, additionalPayload?: any): string {
    const payload = {
      userId,
      ...additionalPayload,
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '24h',
      issuer: 'ai-agent-system',
      audience: 'api-users'
    });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId, type: 'refresh' }, config.jwtSecret, {
      expiresIn: '30d'
    });
  }

  private generateVerificationToken(userId: string): string {
    return jwt.sign({ userId, type: 'verification' }, config.jwtSecret, {
      expiresIn: '24h'
    });
  }

  private async verifyMFACode(userId: string, code: string): Promise<boolean> {
    // Implement TOTP verification
    // This would integrate with a library like 'speakeasy'
    return true; // Mock implementation
  }
}`;
  }

  private getAdvancedAuthMiddleware(): string {
    return `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';
import { AuditLogger } from '../utils/auditLogger';
import { User } from '../models/User';

export interface EnhancedAuthRequest extends Request {
  userId?: string;
  user?: any;
  sessionId?: string;
}

// IP-based rate limiting
export const ipRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  message: {
    error: 'Too many requests from this IP',
    code: 'IP_RATE_LIMITED'
  }
});

// User-based rate limiting
export const userRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // 1000 requests per window per user
  keyGenerator: (req: EnhancedAuthRequest) => req.userId || req.ip,
  message: {
    error: 'Too many requests from this user',
    code: 'USER_RATE_LIMITED'
  }
});

// Enhanced authentication middleware with session management
export const enhancedAuth = async (
  req: EnhancedAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    AuditLogger.logSecurityEvent('AUTH_TOKEN_MISSING', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    });

    res.status(401).json({
      error: 'Access token required',
      code: 'TOKEN_MISSING'
    });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as any;

    // Additional security checks
    if (!decoded.userId) {
      throw new jwt.JsonWebTokenError('Invalid token structure');
    }

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      AuditLogger.logSecurityEvent('AUTH_USER_NOT_FOUND', {
        userId: decoded.userId,
        ip: req.ip
      });

      res.status(401).json({
        error: 'User no longer exists',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    // Check if account is locked
    if (user.accountLockedUntil && new Date(user.accountLockedUntil) > new Date()) {
      AuditLogger.logSecurityEvent('AUTH_LOCKED_ACCOUNT', {
        userId: user.id,
        ip: req.ip
      });

      res.status(423).json({
        error: 'Account is locked',
        code: 'ACCOUNT_LOCKED'
      });
      return;
    }

    // Check if token was issued before last password change
    if (user.passwordChangedAt && decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)) {
      AuditLogger.logSecurityEvent('AUTH_TOKEN_EXPIRED_PASSWORD_CHANGE', {
        userId: user.id,
        ip: req.ip
      });

      res.status(401).json({
        error: 'Token invalid due to password change',
        code: 'TOKEN_INVALIDATED'
      });
      return;
    }

    req.userId = decoded.userId;
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      mfaEnabled: user.mfaEnabled,
      role: user.role || 'user'
    };
    req.sessionId = decoded.sessionId;

    // Log successful authentication
    console.log(\`Authentication successful for user: \${req.userId}\`);

    next();

  } catch (error) {
    console.warn(\`Authentication failed: \${error}\`);

    let errorCode = 'AUTH_ERROR';
    let statusCode = 500;
    let message = 'Authentication failed';

    if (error instanceof jwt.TokenExpiredError) {
      errorCode = 'TOKEN_EXPIRED';
      statusCode = 401;
      message = 'Token has expired';
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorCode = 'TOKEN_INVALID';
      statusCode = 403;
      message = 'Invalid token';
    } else if (error instanceof jwt.NotBeforeError) {
      errorCode = 'TOKEN_NOT_ACTIVE';
      statusCode = 401;
      message = 'Token not active';
    }

    AuditLogger.logSecurityEvent('AUTH_FAILED', {
      error: message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      code: errorCode
    });

    res.status(statusCode).json({
      error: message,
      code: errorCode
    });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: EnhancedAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(403).json({
        error: 'Insufficient permissions',
        code: 'ROLE_REQUIRED'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      AuditLogger.logSecurityEvent('AUTH_INSUFFICIENT_ROLE', {
        userId: req.userId,
        requiredRoles: roles,
        userRole: req.user.role,
        ip: req.ip
      });

      res.status(403).json({
        error: 'Access denied for this role',
        code: 'ROLE_FORBIDDEN',
        requiredRoles: roles
      });
      return;
    }

    next();
  };
};

// Verification requirement middleware
export const requireVerification = (
  req: EnhancedAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !req.user.isVerified) {
    res.status(403).json({
      error: 'Email verification required',
      code: 'VERIFICATION_REQUIRED'
    });
    return;
  }

  next();
};

// MFA requirement middleware
export const requireMFA = (
  req: EnhancedAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !req.user.mfaEnabled) {
    res.status(403).json({
      error: 'Multi-factor authentication required',
      code: 'MFA_REQUIRED'
    });
    return;
  }

  next();
};

// Security headers middleware
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  if (config.nodeEnv === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};`;
  }

  private getAdvancedTaskController(): string {
    return `import { Request, Response } from 'express';
import { EnhancedAuthRequest } from '../middleware/advancedAuth';
import { validateInput, validateObjectId } from '../utils/validation';
import { Task } from '../models/Task';
import { AuditLogger } from '../utils/auditLogger';

export class AdvancedTaskController {
  /**
   * Create task with advanced features
   */
  async createTask(req: EnhancedAuthRequest, res: Response): Promise<void> {
    const startTime = Date.now();
    console.log(\`[\${new Date().toISOString()}] Creating task for user: \${req.userId}\`);

    try {
      const userId = req.userId!;
      const {
        title,
        description,
        priority,
        dueDate,
        tags,
        category,
        assignees,
        dependencies
      } = req.body;

      // Comprehensive validation
      const validationErrors = validateInput(req.body, ['title']);
      if (validationErrors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationErrors,
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      // Validate priority
      if (priority && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
        res.status(400).json({
          error: 'Invalid priority value',
          code: 'INVALID_PRIORITY'
        });
        return;
      }

      // Validate due date
      if (dueDate && new Date(dueDate) < new Date()) {
        res.status(400).json({
          error: 'Due date cannot be in the past',
          code: 'INVALID_DUE_DATE'
        });
        return;
      }

      // Validate assignees
      if (assignees && Array.isArray(assignees)) {
        for (const assigneeId of assignees) {
          if (!validateObjectId(assigneeId)) {
            res.status(400).json({
              error: 'Invalid assignee ID',
              code: 'INVALID_ASSIGNEE'
            });
            return;
          }
        }
      }

      const task = await Task.create({
        title: title.trim(),
        description: description?.trim() || '',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: tags || [],
        category: category || 'general',
        userId,
        assignees: assignees || [],
        dependencies: dependencies || [],
        status: 'todo',
        progress: 0
      });

      AuditLogger.logActivity('TASK_CREATED', {
        userId,
        taskId: task.id,
        taskTitle: task.title
      });

      res.status(201).json({
        message: 'Task created successfully',
        task: this.sanitizeTask(task)
      });

      const duration = Date.now() - startTime;
      console.log(\`[\${new Date().toISOString()}] Task created - Duration: \${duration}ms\`);

    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Task creation failed'
      });
    }
  }

  /**
   * Get tasks with advanced filtering and pagination
   */
  async getTasks(req: EnhancedAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const {
        page = '1',
        limit = '20',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        status,
        priority,
        category,
        tags,
        search,
        assignee,
        dueBefore,
        dueAfter,
        includeCompleted = 'true'
      } = req.query;

      // Build filter object
      const filters: any = { userId };

      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (category) filters.category = category;
      if (assignee) filters.assignees = { $in: [assignee] };
      if (includeCompleted === 'false') filters.status = { $ne: 'completed' };

      // Date filters
      if (dueBefore || dueAfter) {
        filters.dueDate = {};
        if (dueBefore) filters.dueDate.$lte = new Date(dueBefore as string);
        if (dueAfter) filters.dueDate.$gte = new Date(dueAfter as string);
      }

      // Tag filters
      if (tags) {
        const tagArray = typeof tags === 'string' ? tags.split(',') : tags;
        filters.tags = { $in: tagArray };
      }

      // Search functionality
      if (search) {
        filters.$text = { $search: search };
      }

      const options = {
        page: parseInt(page as string),
        limit: Math.min(parseInt(limit as string), 100), // Max 100 items
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await Task.findByFilters(filters, options);

      // Calculate analytics
      const analytics = await this.calculateTaskAnalytics(userId);

      res.json({
        tasks: result.items.map(task => this.sanitizeTask(task)),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1
        },
        analytics
      });

    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch tasks'
      });
    }
  }

  /**
   * Update task with comprehensive validation
   */
  async updateTask(req: EnhancedAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { taskId } = req.params;
      const updates = req.body;

      if (!validateObjectId(taskId)) {
        res.status(400).json({
          error: 'Invalid task ID',
          code: 'INVALID_TASK_ID'
        });
        return;
      }

      const task = await Task.findById(taskId);
      if (!task) {
        res.status(404).json({
          error: 'Task not found',
          code: 'TASK_NOT_FOUND'
        });
        return;
      }

      // Check permissions
      const hasPermission = task.userId === userId ||
                           task.assignees?.includes(userId) ||
                           req.user?.role === 'admin';

      if (!hasPermission) {
        res.status(403).json({
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
        return;
      }

      // Validate updates
      if (updates.priority && !['low', 'medium', 'high', 'urgent'].includes(updates.priority)) {
        res.status(400).json({
          error: 'Invalid priority value',
          code: 'INVALID_PRIORITY'
        });
        return;
      }

      if (updates.progress && (updates.progress < 0 || updates.progress > 100)) {
        res.status(400).json({
          error: 'Progress must be between 0 and 100',
          code: 'INVALID_PROGRESS'
        });
        return;
      }

      // Auto-update status based on progress
      if (updates.progress !== undefined) {
        if (updates.progress === 0) {
          updates.status = 'todo';
        } else if (updates.progress === 100) {
          updates.status = 'completed';
          updates.completedAt = new Date();
        } else {
          updates.status = 'in-progress';
        }
      }

      const updatedTask = await Task.updateById(taskId, {
        ...updates,
        updatedAt: new Date()
      });

      AuditLogger.logActivity('TASK_UPDATED', {
        userId,
        taskId: task.id,
        updates: Object.keys(updates)
      });

      res.json({
        message: 'Task updated successfully',
        task: this.sanitizeTask(updatedTask!)
      });

    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Task update failed'
      });
    }
  }

  /**
   * Bulk operations for tasks
   */
  async bulkUpdateTasks(req: EnhancedAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { taskIds, updates } = req.body;

      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        res.status(400).json({
          error: 'Task IDs array is required',
          code: 'MISSING_TASK_IDS'
        });
        return;
      }

      if (taskIds.length > 50) {
        res.status(400).json({
          error: 'Cannot update more than 50 tasks at once',
          code: 'TOO_MANY_TASKS'
        });
        return;
      }

      const results = await Task.bulkUpdate(taskIds, updates, userId);

      AuditLogger.logActivity('TASKS_BULK_UPDATED', {
        userId,
        taskCount: taskIds.length,
        updates: Object.keys(updates)
      });

      res.json({
        message: 'Tasks updated successfully',
        updated: results.updated,
        failed: results.failed
      });

    } catch (error) {
      console.error('Bulk update error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  private sanitizeTask(task: any) {
    // Remove sensitive fields and format response
    const { password, ...sanitized } = task;
    return {
      ...sanitized,
      createdAt: task.createdAt?.toISOString(),
      updatedAt: task.updatedAt?.toISOString(),
      dueDate: task.dueDate?.toISOString(),
      completedAt: task.completedAt?.toISOString()
    };
  }

  private async calculateTaskAnalytics(userId: string) {
    // Calculate task statistics
    return {
      totalTasks: await Task.countByUser(userId),
      completedToday: await Task.countCompletedToday(userId),
      overdueTasks: await Task.countOverdue(userId),
      productivityScore: await Task.calculateProductivityScore(userId)
    };
  }
}`;
  }
}