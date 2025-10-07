// Direct API test using fetch
require('dotenv').config();

async function testDirectAPI() {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log('🔑 API Key:', apiKey.substring(0, 10) + '...');
  console.log('\n📋 Testing different API endpoints...\n');

  // Test v1 API
  const modelsToTest = [
    { name: 'gemini-pro', endpoint: 'v1' },
    { name: 'gemini-1.5-flash', endpoint: 'v1' },
    { name: 'gemini-1.5-pro', endpoint: 'v1' },
    { name: 'gemini-pro', endpoint: 'v1beta' }
  ];

  for (const { name, endpoint } of modelsToTest) {
    const url = `https://generativelanguage.googleapis.com/${endpoint}/models/${name}:generateContent?key=${apiKey}`;

    console.log(`\n🧪 Testing: ${endpoint}/models/${name}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Say "Hello"' }]
          }]
        })
      });

      console.log(`   Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ SUCCESS! Response:', JSON.stringify(data, null, 2).substring(0, 200));
        return; // Found working model
      } else {
        const errorText = await response.text();
        console.log('   ❌ Error:', errorText.substring(0, 150));
      }
    } catch (error) {
      console.log('   ❌ Request failed:', error.message);
    }
  }

  // Try to check API key validity
  console.log('\n\n🔍 Checking API key status directly...');
  const checkUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

  try {
    const response = await fetch(checkUrl);
    console.log(`Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Available models:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

testDirectAPI().catch(console.error);
