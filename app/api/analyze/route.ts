import { NextRequest, NextResponse } from 'next/server';
import { AIAgentSystem } from '@/lib/AIAgentSystem';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, requirements, constraints } = body;

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Initialize the AI Agent System
    const agentSystem = new AIAgentSystem(true);

    // Create project brief
    const projectBrief = {
      description,
      requirements: requirements || [],
      constraints: constraints || []
    };

    // Get task breakdown with AI analysis
    const result = await agentSystem.breakdownOnly(projectBrief);

    return NextResponse.json({
      tasks: result.tasks,
      executionPlan: result.executionPlan,
      aiAnalysis: result.aiAnalysis,
      projectSummary: description
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
