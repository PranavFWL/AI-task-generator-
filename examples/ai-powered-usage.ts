import { AIAgentSystem, ProjectBrief } from '../src';

async function aiPoweredExample() {
  console.log('🤖 AI-Powered Agent System - Advanced Usage Example\n');

  // Create AI-powered system (AI mode enabled by default)
  const aiSystem = new AIAgentSystem(true);

  // Test AI connectivity first
  console.log('🔍 Testing AI connectivity...');
  const isConnected = await aiSystem.testAIConnection();

  if (!isConnected) {
    console.log('⚠️ AI not available, switching to fallback mode');
    aiSystem.setAIMode(false);
  }

  // Display system status
  const status = aiSystem.getSystemStatus();
  console.log('📊 System Status:', status);

  // Example 1: Advanced E-commerce Platform
  const ecommerceBrief: ProjectBrief = {
    description: 'Build a modern e-commerce platform with advanced features including user authentication, product catalog with search and filtering, shopping cart with real-time updates, order management system, payment integration, admin dashboard, and mobile-responsive design',
    requirements: [
      'User registration and authentication with social login',
      'Product catalog with advanced search, filtering, and sorting',
      'Shopping cart with persistent storage and real-time updates',
      'Secure checkout process with multiple payment options',
      'Order tracking and management system',
      'Admin dashboard for product and order management',
      'Real-time inventory management',
      'Customer reviews and ratings system',
      'Wishlist and favorites functionality',
      'Mobile-responsive design with PWA features'
    ],
    constraints: [
      'Use React with TypeScript for frontend',
      'Use Node.js with Express for backend',
      'Implement proper security measures',
      'Ensure scalable database design',
      'Include comprehensive error handling',
      'Implement real-time features where applicable'
    ],
    timeline: '6 weeks'
  };

  try {
    console.log('\n🛍️ Processing Advanced E-commerce Platform...');
    const result1 = await aiSystem.processProject(ecommerceBrief);

    console.log('\n🧠 AI Analysis:');
    if (result1.aiAnalysis) {
      console.log(result1.aiAnalysis);
    }

    console.log('\n📋 Generated Tasks Summary:');
    const tasksByType = result1.tasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(tasksByType).forEach(([type, count]) => {
      console.log(`• ${type.toUpperCase()}: ${count} tasks`);
    });

    const totalEstimated = result1.tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    if (totalEstimated > 0) {
      console.log(`⏱️ Total Estimated Time: ${totalEstimated} hours`);
    }

    console.log('\n📈 AI-Generated Files Summary:');
    const totalFiles = result1.results.reduce((acc, r) => acc + (r.files?.length || 0), 0);
    console.log(`Total files generated: ${totalFiles}`);

    // Group files by type
    const filesByType: { [key: string]: number } = {};
    result1.results.forEach(r => {
      r.files?.forEach(file => {
        filesByType[file.type] = (filesByType[file.type] || 0) + 1;
      });
    });

    Object.entries(filesByType).forEach(([type, count]) => {
      console.log(`- ${type}: ${count} files`);
    });

    if (result1.aiInsights) {
      console.log('\n🔮 AI Insights:');
      console.log(result1.aiInsights);
    }

  } catch (error) {
    console.error('❌ Error processing e-commerce project:', error);
  }
}

async function aiAnalysisOnlyExample() {
  console.log('\n🧠 AI Analysis Only - Social Media Platform\n');

  const aiSystem = new AIAgentSystem(true);

  const socialMediaBrief: ProjectBrief = {
    description: 'Create a comprehensive social media platform with user profiles, posts with media support, real-time messaging, friend connections, news feed algorithm, content moderation, and analytics dashboard',
    requirements: [
      'User profiles with customizable information',
      'Post creation with text, images, and video support',
      'Real-time messaging between users',
      'Friend/follower system with privacy controls',
      'News feed with algorithmic content ranking',
      'Content moderation and reporting system',
      'Analytics dashboard for user engagement',
      'Notification system for user interactions',
      'Mobile app support with offline capabilities'
    ],
    constraints: [
      'Handle high traffic and concurrent users',
      'Implement robust content moderation',
      'Ensure data privacy and security',
      'Support real-time features',
      'Scalable architecture for growth'
    ],
    timeline: '12 weeks'
  };

  try {
    // Only analyze and breakdown, don't execute
    const breakdown = await aiSystem.breakdownOnly(socialMediaBrief);

    console.log('📊 AI Project Analysis:');
    if (breakdown.aiAnalysis) {
      console.log(breakdown.aiAnalysis);
    }

    console.log('\n📋 Execution Plan:');
    console.log(breakdown.executionPlan);

    console.log('\n🎯 Detailed Task Breakdown:');
    breakdown.tasks.forEach((task, index) => {
      console.log(`\n${index + 1}. ${task.title}`);
      console.log(`   📂 Type: ${task.type}`);
      console.log(`   🔥 Priority: ${task.priority}`);
      console.log(`   📝 Description: ${task.description}`);
      if (task.estimatedHours) {
        console.log(`   ⏱️ Estimated Hours: ${task.estimatedHours}`);
      }
      console.log(`   ✅ Acceptance Criteria:`);
      task.acceptance_criteria.forEach(criteria => {
        console.log(`      • ${criteria}`);
      });
    });

  } catch (error) {
    console.error('❌ Error analyzing social media project:', error);
  }
}

async function fallbackComparisonExample() {
  console.log('\n🔄 AI vs Fallback Comparison\n');

  const projectBrief: ProjectBrief = {
    description: 'Build a task management application with team collaboration features',
    requirements: [
      'User authentication and authorization',
      'Task creation, editing, and deletion',
      'Team workspace management',
      'Real-time collaboration features',
      'File attachment support'
    ]
  };

  // Test with AI mode
  console.log('🤖 Processing with AI mode...');
  const aiSystem = new AIAgentSystem(true);
  const aiResult = await aiSystem.breakdownOnly(projectBrief);

  console.log(`AI Generated Tasks: ${aiResult.tasks.length}`);
  if (aiResult.aiAnalysis) {
    console.log('AI provided detailed analysis ✅');
  }

  // Test with fallback mode
  console.log('\n🔄 Processing with fallback mode...');
  const fallbackSystem = new AIAgentSystem(false);
  const fallbackResult = await fallbackSystem.breakdownOnly(projectBrief);

  console.log(`Fallback Generated Tasks: ${fallbackResult.tasks.length}`);
  console.log('Fallback used rule-based logic ✅');

  console.log('\n📊 Comparison:');
  console.log(`• AI Mode: ${aiResult.tasks.length} tasks with intelligent analysis`);
  console.log(`• Fallback Mode: ${fallbackResult.tasks.length} tasks with rule-based logic`);
}

async function specificTaskExecutionExample() {
  console.log('\n🎯 Specific Task Execution Example\n');

  const aiSystem = new AIAgentSystem(true);

  // Create some specific tasks to execute
  const specificTasks = [
    {
      id: 'custom-1',
      title: 'Implement Advanced User Authentication with 2FA',
      description: 'Create a comprehensive authentication system with two-factor authentication, social login, and password recovery',
      type: 'backend' as const,
      priority: 'high' as const,
      acceptance_criteria: [
        'Email/password authentication',
        'Two-factor authentication with TOTP',
        'Social login (Google, GitHub)',
        'Password reset functionality',
        'Account verification system',
        'Session management with refresh tokens'
      ],
      estimatedHours: 16
    },
    {
      id: 'custom-2',
      title: 'Build Modern Dashboard with Real-time Analytics',
      description: 'Create an interactive dashboard with real-time data visualization and user analytics',
      type: 'frontend' as const,
      priority: 'high' as const,
      acceptance_criteria: [
        'Interactive charts and graphs',
        'Real-time data updates',
        'Responsive dashboard layout',
        'User activity analytics',
        'Export functionality for reports',
        'Dark/light theme support'
      ],
      estimatedHours: 12
    }
  ];

  console.log('🚀 Executing specific high-priority tasks...');
  const results = await aiSystem.executeSpecificTasks(specificTasks);

  console.log('\n📊 Execution Results:');
  results.forEach((result, index) => {
    const task = specificTasks[index];
    console.log(`\n${index + 1}. ${task.title}`);
    console.log(`   Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (result.files) {
      console.log(`   Files Generated: ${result.files.length}`);
      result.files.forEach(file => {
        console.log(`      • ${file.path}`);
      });
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
}

// Main execution function
async function runAIPoweredExamples() {
  try {
    await aiPoweredExample();
    await aiAnalysisOnlyExample();
    await fallbackComparisonExample();
    await specificTaskExecutionExample();

    console.log('\n🎉 All AI-powered examples completed successfully!');
    console.log('\n💡 Next Steps:');
    console.log('• Install dependencies: npm install');
    console.log('• Set up environment: copy .env.example to .env');
    console.log('• Run with AI: npm run example:ai');
    console.log('• Build project: npm run build');

  } catch (error) {
    console.error('💥 Error running AI examples:', error);
  }
}

if (require.main === module) {
  runAIPoweredExamples().catch(console.error);
}

export {
  aiPoweredExample,
  aiAnalysisOnlyExample,
  fallbackComparisonExample,
  specificTaskExecutionExample
};