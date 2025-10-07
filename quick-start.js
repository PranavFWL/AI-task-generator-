// Quick Start Guide for Software_Lab AI Agent System
// This script will guide you through building your first AI-generated project

require('dotenv').config();
const { AIAgentSystem } = require('./dist/AIAgentSystem');

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🤖 AI AGENT SYSTEM - QUICK START GUIDE');
  console.log('='.repeat(80) + '\n');

  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ ERROR: GEMINI_API_KEY not found in .env file');
    console.log('Please add your Gemini API key to the .env file first.');
    return;
  }

  console.log('✅ Gemini API Key: Configured');
  console.log('🚀 Initializing AI Agent System...\n');

  const agentSystem = new AIAgentSystem(true); // true = use AI mode

  // Example project prompt
  const projectBrief = {
    description: 'Build a simple blog website with user authentication',
    requirements: [
      'User can register and login',
      'Users can create, edit, and delete blog posts',
      'Display list of all blog posts',
      'Responsive design for mobile and desktop'
    ],
    constraints: [
      'Use React for frontend',
      'Use Express.js for backend',
      'Use REST API architecture'
    ],
    timeline: '1 week'
  };

  console.log('📋 PROJECT BRIEF:');
  console.log('-----------------------------------');
  console.log(`Description: ${projectBrief.description}`);
  console.log(`\nRequirements:`);
  projectBrief.requirements.forEach((req, i) => {
    console.log(`  ${i + 1}. ${req}`);
  });
  console.log(`\nConstraints:`);
  projectBrief.constraints.forEach((con, i) => {
    console.log(`  ${i + 1}. ${con}`);
  });
  console.log(`\nTimeline: ${projectBrief.timeline}`);
  console.log('-----------------------------------\n');

  try {
    console.log('⚡ Processing your project brief with AI...\n');

    // Process the project
    const result = await agentSystem.processProject(projectBrief);

    console.log('\n' + '='.repeat(80));
    console.log('✅ PROJECT GENERATION COMPLETED!');
    console.log('='.repeat(80) + '\n');

    // Display generated tasks
    console.log('📊 GENERATED TASKS:');
    console.log('-----------------------------------');
    result.tasks.forEach((task, index) => {
      console.log(`\n${index + 1}. ${task.title}`);
      console.log(`   Type: ${task.type.toUpperCase()}`);
      console.log(`   Priority: ${task.priority.toUpperCase()}`);
      console.log(`   Description: ${task.description}`);
    });

    // Display file statistics
    console.log('\n\n📁 GENERATED FILES:');
    console.log('-----------------------------------');
    let totalFiles = 0;
    const filesByType = {};

    result.results.forEach(taskResult => {
      if (taskResult.files) {
        totalFiles += taskResult.files.length;
        taskResult.files.forEach(file => {
          filesByType[file.type] = (filesByType[file.type] || 0) + 1;
        });
      }
    });

    console.log(`Total files generated: ${totalFiles}\n`);
    console.log('Files by type:');
    Object.entries(filesByType).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} file(s)`);
    });

    // Display summary
    console.log('\n\n📈 PROJECT SUMMARY:');
    console.log('-----------------------------------');
    console.log(result.summary);

    if (result.aiInsights) {
      console.log('\n\n💡 AI INSIGHTS:');
      console.log('-----------------------------------');
      console.log(result.aiInsights);
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎉 SUCCESS! Your project has been generated.');
    console.log('Check the output above for all generated code files.');
    console.log('='.repeat(80) + '\n');

    console.log('📚 NEXT STEPS:');
    console.log('  1. Review the generated tasks and code');
    console.log('  2. Modify the projectBrief in this file to build something else');
    console.log('  3. Run again: node quick-start.js');
    console.log('  4. Check examples/ folder for more advanced usage\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Full error:', error);
  }
}

// Run the script
main().catch(console.error);
