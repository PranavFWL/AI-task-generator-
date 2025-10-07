import { AIAgentSystem, ProjectBrief } from '../src';

async function basicExample() {
  console.log('🚀 AI Agent System - Basic Usage Example\n');

  const agentSystem = new AIAgentSystem();

  // Example 1: Task Management App
  const taskManagementBrief: ProjectBrief = {
    description: 'Build a task management app with user authentication and task sharing',
    requirements: [
      'User registration and login',
      'Create, read, update, delete tasks',
      'Share tasks with other users',
      'Responsive web interface'
    ],
    constraints: [
      'Use React for frontend',
      'Use REST API for backend',
      'Include proper authentication'
    ],
    timeline: '2 weeks'
  };

  try {
    console.log('📋 Processing Task Management App...');
    const result1 = await agentSystem.processProject(taskManagementBrief);

    console.log('\n📊 Generated Tasks:');
    result1.tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} [${task.type}] - Priority: ${task.priority}`);
    });

    console.log('\n📈 Generated Files Summary:');
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

  } catch (error) {
    console.error('❌ Error processing project:', error);
  }
}

async function ecommercExample() {
  console.log('\n🛍️ AI Agent System - E-commerce Example\n');

  const agentSystem = new AIAgentSystem();

  const ecommerceBrief: ProjectBrief = {
    description: 'Create an e-commerce platform with product catalog, shopping cart, and user authentication',
    requirements: [
      'Product catalog with search and filtering',
      'Shopping cart functionality',
      'User registration and authentication',
      'Order management system',
      'Admin panel for product management'
    ],
    constraints: [
      'Mobile-first responsive design',
      'RESTful API architecture',
      'Secure payment processing'
    ]
  };

  try {
    // Only breakdown tasks, don't execute
    const breakdown = await agentSystem.breakdownOnly(ecommerceBrief);

    console.log('📋 E-commerce Project Breakdown:');
    console.log(breakdown.executionPlan);

    console.log('\n🎯 Task Details:');
    breakdown.tasks.forEach((task, index) => {
      console.log(`\n${index + 1}. ${task.title}`);
      console.log(`   Type: ${task.type}`);
      console.log(`   Priority: ${task.priority}`);
      console.log(`   Description: ${task.description}`);
      console.log(`   Acceptance Criteria:`);
      task.acceptance_criteria.forEach(criteria => {
        console.log(`   ✓ ${criteria}`);
      });
    });

  } catch (error) {
    console.error('❌ Error processing e-commerce project:', error);
  }
}

// Run examples
async function runExamples() {
  await basicExample();
  await ecommercExample();
}

if (require.main === module) {
  runExamples().catch(console.error);
}

export { basicExample, ecommercExample };