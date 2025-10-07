import { AIAgentSystem, ProjectBrief } from './src';

async function testMyProject() {
  console.log('🎯 Testing My Custom Project\n');

  const aiSystem = new AIAgentSystem(true);

  // 📝 REPLACE THIS WITH YOUR PROJECT DESCRIPTION
  const myProject: ProjectBrief = {
    description: 'Build an realestate app where people can list their property and other people can view those properties. Just like an amazon.com for real-estate',
    requirements: [
      'Rigorous user and property authentication',
      'High-quality image upload and gallery',
      'Portfolio creation and customization',
      'Client booking and appointment system',
      'Payment processing for bookings',
      'Image licensing and download system',
      'Realtime chatting',
      'Search and filter photographers by location'
    ],
    constraints: [
      'Handle high-resolution images efficiently',
      'Mobile-responsive design',
      'SEO optimization for portfolios',
      'Secure payment processing',
      'Real-time notifications'
    ],
    timeline: '10 weeks'
  };

  try {
    console.log('📋 Project Description:');
    console.log(myProject.description);
    console.log(`\nRequirements: ${myProject.requirements?.length || 0} items`);
    console.log(`Timeline: ${myProject.timeline}\n`);

    console.log('🤖 Processing with AI Agent System...\n');

    const result = await aiSystem.processProject(myProject);

    console.log('📊 Results:');
    console.log(`✅ Generated ${result.tasks.length} technical tasks`);
    console.log(`✅ Created ${result.results.reduce((sum, r) => sum + (r.files?.length || 0), 0)} code files`);

    console.log('\n🎯 Generated Tasks:');
    result.tasks.forEach((task, index) => {
      console.log(`${index + 1}. [${task.type.toUpperCase()}] ${task.title}`);
      console.log(`   Priority: ${task.priority}`);
      if (task.estimatedHours) {
        console.log(`   Estimated: ${task.estimatedHours} hours`);
      }
      console.log('');
    });

    if (result.aiAnalysis) {
      console.log('🧠 AI Analysis:');
      console.log(result.aiAnalysis);
    }

    if (result.aiInsights) {
      console.log('\n🔮 AI Insights:');
      console.log(result.aiInsights);
    }

    console.log('\n📁 Generated Files by Type:');
    const filesByType: { [key: string]: number } = {};
    result.results.forEach(r => {
      r.files?.forEach(file => {
        filesByType[file.type] = (filesByType[file.type] || 0) + 1;
      });
    });

    Object.entries(filesByType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} files`);
    });

    console.log('\n🎉 Your project analysis is complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// 🚀 TO USE THIS FILE:
// 1. Edit the 'myProject' object above with your description
// 2. Run: npx ts-node my-project-test.ts

testMyProject().catch(console.error);