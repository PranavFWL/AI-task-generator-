import { NextRequest, NextResponse } from 'next/server';
import { ADKAgentSystem } from '@/lib/parent/ADKAgentSystem';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, requirements, constraints, useADK = true } = body;

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    console.log(`🤖 Using Google ADK Agent System`);

    // Initialize Google ADK Agent System
    const agentSystem = new ADKAgentSystem(true);

    // Create project brief
    const projectBrief = {
      description,
      requirements: requirements || [],
      constraints: constraints || []
    };

    // Process project and generate code
    const result = await agentSystem.processProject(projectBrief);

    // Extract generated files from results
    const generatedFiles = result.results
      .filter(r => r.success && r.files)
      .flatMap(r => r.files || []);

    console.log(`[Data] Extracted ${generatedFiles.length} files for frontend display`);
    console.log(`[Data] File types breakdown:`, generatedFiles.reduce((acc: any, f: any) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {}));

    return NextResponse.json({
      tasks: result.tasks,
      executionPlan: result.executionPlan,
      aiAnalysis: result.aiAnalysis,
      aiInsights: result.aiInsights,
      projectSummary: description,
      generatedFiles: generatedFiles,
      summary: result.summary,
      framework: 'Google ADK v0.1.3',
      agentSystem: 'Google Agent Development Kit (Multi-Agent)',
      totalFiles: generatedFiles.length
    });
  } catch (error) {
    console.error('Error analyzing project:', error);

    return NextResponse.json(
      {
        error: 'Failed to analyze project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
