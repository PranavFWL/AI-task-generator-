import { AIAgentSystem } from './src/AIAgentSystem';

async function testRealAI() {
  console.log('🤖 Testing Real Gemini AI Integration\n');

  // Create AI-powered system
  const aiSystem = new AIAgentSystem(true);

  // Test connectivity
  console.log('🔍 Testing AI connectivity...');
  const isConnected = await aiSystem.testAIConnection();

  if (isConnected) {
    console.log('✅ Gemini AI connected successfully!');
  } else {
    console.log('⚠️ Using fallback mode');
  }

  // Test project brief
  const projectBrief = {
    description: 'Build a modern task management app with user authentication and real-time collaboration features',
    requirements: [
      'User registration and login with email verification',
      'Task creation, editing, and deletion with categories',
      'Real-time collaboration between team members',
      'File attachments and comments on tasks',
      'Dashboard with analytics and progress tracking'
    ],
    constraints: [
      'Use React with TypeScript for frontend',
      'Use Node.js with Express for backend',
      'Implement proper security and validation',
      'Mobile-responsive design required'
    ],
    timeline: '6 weeks'
  };

  console.log('\n📋 Processing Project Brief...');
  console.log(`Description: ${projectBrief.description}`);

  try {
    const result = await aiSystem.processProject(projectBrief);

    console.log('\n📊 Results:');
    console.log(`Generated Tasks: ${result.tasks.length}`);
    console.log(`Generated Files: ${result.results.reduce((sum, r) => sum + (r.files?.length || 0), 0)}`);

    if (result.aiAnalysis) {
      console.log('\n🧠 AI Analysis Available: ✅');
    }

    if (result.aiInsights) {
      console.log('🔮 AI Insights Available: ✅');
    }

    console.log('\n🎉 AI-Powered Agent System Working Successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testRealAI().catch(console.error);