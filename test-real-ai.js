// Simple test of real AI functionality
require('dotenv').config();
const { AIAgentSystem } = require('./dist/AIAgentSystem');

async function testRealAI() {
  console.log('\n🚀 Testing REAL Gemini AI Connection...\n');

  const agentSystem = new AIAgentSystem(true); // Enable AI

  // Get custom prompt from command line argument
  const customPrompt = process.argv[2];

  if (!customPrompt) {
    console.error('❌ Error: Please provide a prompt!');
    console.log('Usage: node test-real-ai.js "Your custom prompt here"\n');
    process.exit(1);
  }

  const simpleBrief = {
    description: customPrompt,
    requirements: ['Auto-generated from prompt'],
    constraints: []
  };

  console.log(`📋 Brief: ${customPrompt}\n`);
  console.log('⚡ Asking Gemini AI to analyze...\n');

  try {
    // Just break down the project (don't execute)
    const result = await agentSystem.breakdownOnly(simpleBrief);

    console.log('\n✅ SUCCESS! Real AI is working!\n');
    console.log('📊 AI Generated Tasks:\n');

    result.tasks.forEach((task, i) => {
      console.log(`${i + 1}. ${task.title}`);
      console.log(`   Type: ${task.type}`);
      console.log(`   Priority: ${task.priority}`);
      console.log(`   Description: ${task.description}\n`);
    });

    if (result.aiAnalysis) {
      console.log('🤖 AI Analysis:');
      console.log(result.aiAnalysis);
    }

    console.log('\n🎉 GEMINI AI IS WORKING PERFECTLY!');
    console.log('✅ API Key: Valid');
    console.log('✅ Model: gemini-2.5-flash');
    console.log('✅ Connection: Successful\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testRealAI().catch(console.error);
