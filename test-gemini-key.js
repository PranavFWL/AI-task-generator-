const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiKey() {
  console.log('🔍 Testing Gemini AI API Key...\n');

  const apiKey = process.env.GEMINI_API_KEY;
  console.log(`🔑 API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND'}`);
  console.log(`🔑 API Key length: ${apiKey ? apiKey.length : 0}\n`);

  if (!apiKey) {
    console.log('❌ No API key found in environment variables');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ GoogleGenerativeAI client created successfully\n');

    // Try to list models
    console.log('📋 Attempting to list available models...');
    try {
      const models = await genAI.listModels();
      console.log(`✅ Found ${models.length} available models:\n`);

      models.forEach(model => {
        console.log(`  📄 ${model.name}`);
        if (model.displayName) console.log(`      Display: ${model.displayName}`);
        if (model.description) console.log(`      Description: ${model.description}`);
        console.log(`      Supports generateContent: ${model.supportedGenerationMethods?.includes('generateContent') ? '✅' : '❌'}`);
        console.log('');
      });

      // Test the first working model
      const workingModels = models.filter(m => m.supportedGenerationMethods?.includes('generateContent'));
      if (workingModels.length > 0) {
        const testModel = workingModels[0];
        console.log(`🧪 Testing model: ${testModel.name}`);

        const model = genAI.getGenerativeModel({ model: testModel.name });
        const result = await model.generateContent('Hello, how are you?');
        const response = await result.response;
        const text = response.text();

        console.log(`✅ Test successful! Response: ${text.substring(0, 100)}...`);
      }

    } catch (listError) {
      console.log(`❌ Failed to list models: ${listError.message}`);

      // Try common model names directly
      const commonModels = ['gemini-pro', 'gemini-1.5-flash', 'models/gemini-pro', 'models/gemini-1.5-flash'];

      console.log('\n🧪 Testing common model names directly...');
      for (const modelName of commonModels) {
        try {
          console.log(`Testing: ${modelName}`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent('Hello');
          console.log(`✅ ${modelName} works!`);
          break;
        } catch (error) {
          console.log(`❌ ${modelName}: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.log(`❌ Failed to create GoogleGenerativeAI client: ${error.message}`);
    console.log('Full error:', error);
  }
}

testGeminiKey().catch(console.error);