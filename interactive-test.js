const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎯 Interactive AI Agent System Test\n');
console.log('Enter your project description and see the AI analysis!\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runInteractiveTest() {
  try {
    // Get project description
    const description = await askQuestion('📝 Enter your project description: ');

    // Get requirements
    console.log('\n📋 Enter requirements (press Enter twice when done):');
    const requirements = [];
    let requirement;
    do {
      requirement = await askQuestion('  - ');
      if (requirement.trim()) {
        requirements.push(requirement.trim());
      }
    } while (requirement.trim());

    // Get constraints
    console.log('\n⚠️ Enter constraints (press Enter twice when done):');
    const constraints = [];
    let constraint;
    do {
      constraint = await askQuestion('  - ');
      if (constraint.trim()) {
        constraints.push(constraint.trim());
      }
    } while (constraint.trim());

    const timeline = await askQuestion('\n⏰ Enter timeline (optional): ');

    // Create project brief
    const projectBrief = {
      description,
      requirements,
      constraints,
      timeline: timeline || 'Not specified'
    };

    console.log('\n🤖 Your Project Brief:');
    console.log('========================');
    console.log(`Description: ${projectBrief.description}`);
    console.log(`Requirements: ${projectBrief.requirements.length} items`);
    console.log(`Constraints: ${projectBrief.constraints.length} items`);
    console.log(`Timeline: ${projectBrief.timeline}`);

    console.log('\n📁 Project brief saved to: custom-project.json');

    // Save to file for use with the AI system
    const fs = require('fs');
    fs.writeFileSync('custom-project.json', JSON.stringify(projectBrief, null, 2));

    console.log('\n🚀 To analyze this with your AI system, run:');
    console.log('   npx ts-node analyze-custom-project.ts');

    rl.close();

  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

runInteractiveTest();