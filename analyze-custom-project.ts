import { AIAgentSystem, ProjectBrief } from './src';
import * as fs from 'fs';

async function analyzeCustomProject() {
  console.log('🤖 Analyzing Your Custom Project\n');

  // Load the project from JSON file
  let projectBrief: ProjectBrief;

  try {
    const projectData = fs.readFileSync('custom-project.json', 'utf8');
    projectBrief = JSON.parse(projectData);
  } catch (error) {
    console.log('❌ No custom project found. Run: node interactive-test.js first');
    return;
  }

  const aiSystem = new AIAgentSystem(true);

  console.log('📋 Loading Your Project:');
  console.log(`Description: ${projectBrief.description}`);
  console.log(`Requirements: ${projectBrief.requirements?.length || 0} items`);
  console.log(`Constraints: ${projectBrief.constraints?.length || 0} items\n`);

  try {
    console.log('🧠 AI Agent System analyzing your project...\n');

    const result = await aiSystem.processProject(projectBrief);

    console.log('🎯 ANALYSIS RESULTS:');
    console.log('====================\n');

    console.log(`📊 Generated ${result.tasks.length} Technical Tasks:`);
    result.tasks.forEach((task, index) => {
      console.log(`\n${index + 1}. ${task.title}`);
      console.log(`   Type: ${task.type}`);
      console.log(`   Priority: ${task.priority}`);
      if (task.estimatedHours) {
        console.log(`   Estimated Hours: ${task.estimatedHours}`);
      }
      console.log(`   Acceptance Criteria:`);
      task.acceptance_criteria.slice(0, 3).forEach(criteria => {
        console.log(`     ✓ ${criteria}`);
      });
      if (task.acceptance_criteria.length > 3) {
        console.log(`     ... and ${task.acceptance_criteria.length - 3} more`);
      }
    });

    const totalFiles = result.results.reduce((sum, r) => sum + (r.files?.length || 0), 0);
    console.log(`\n📁 Generated ${totalFiles} Code Files:`);

    const filesByType: { [key: string]: number } = {};
    result.results.forEach(r => {
      r.files?.forEach(file => {
        filesByType[file.type] = (filesByType[file.type] || 0) + 1;
      });
    });

    Object.entries(filesByType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} files`);
    });

    if (result.aiAnalysis) {
      console.log('\n🧠 AI Analysis:');
      console.log(result.aiAnalysis);
    }

    if (result.aiInsights) {
      console.log('\n🔮 AI Insights:');
      console.log(result.aiInsights);
    }

    const totalHours = result.tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    if (totalHours > 0) {
      console.log(`\n⏰ Total Estimated Time: ${totalHours} hours`);
      console.log(`💰 Estimated Cost (at $50/hour): $${totalHours * 50}`);
    }

    console.log('\n🎉 Your project analysis is complete!');
    console.log('All generated code and analysis details are ready for implementation.');

  } catch (error) {
    console.error('❌ Error analyzing project:', error);
  }
}

analyzeCustomProject().catch(console.error);