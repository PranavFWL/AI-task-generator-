// Test script to check available Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAPIKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('❌ No API key found');
    return;
  }

  console.log('🔑 Testing API Key:', apiKey.substring(0, 10) + '...');
  console.log('🔑 Full length:', apiKey.length);

  const genAI = new GoogleGenerativeAI(apiKey);

  // Try to list available models
  console.log('\n📋 Attempting to list available models...\n');

  try {
    const models = await genAI.listModels();
    console.log('✅ Successfully retrieved model list!\n');

    if (models && models.length > 0) {
      console.log(`Found ${models.length} available models:\n`);
      models.forEach((model) => {
        console.log(`Model: ${model.name}`);
        console.log(`  Display Name: ${model.displayName || 'N/A'}`);
        console.log(`  Description: ${model.description || 'N/A'}`);
        console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('⚠️ No models returned from API');
    }
  } catch (error) {
    console.log('❌ Failed to list models:', error.message);
    console.log('\n🔍 Error details:', error);
  }

  // Try different model variations directly
  console.log('\n🧪 Testing individual models...\n');

  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'models/gemini-pro',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash',
    'gemini-1.0-pro',
    'models/gemini-1.0-pro'
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hello, respond with just "OK"');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ SUCCESS! Model "${modelName}" works! Response: ${text.substring(0, 50)}\n`);
      break; // Found a working model, stop testing
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }
}

testAPIKey().catch(console.error);
