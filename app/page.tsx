'use client';

import { useState } from 'react';
import { Sparkles, Brain, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import CollapsibleTaskCard from '@/components/CollapsibleTaskCard';
import CodeViewer from '@/components/CodeViewer';

interface Task {
  id: string;
  title: string;
  type: string;
  priority: string;
  description: string;
  estimatedHours?: number;
  dependencies?: (string | any)[];
  acceptance_criteria: (string | any)[];
}

interface GeneratedFile {
  path: string;
  content: string;
  type: string;
}

interface AnalysisResult {
  tasks: Task[];
  executionPlan: string;
  aiAnalysis?: string;
  projectSummary?: string;
  generatedFiles?: GeneratedFile[];
  summary?: string;
  aiInsights?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allExpanded, setAllExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze project');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AgentTask AI
              </h1>
              <p className="text-sm text-slate-600">Transform ideas into actionable tasks</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Input Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Describe Your Project</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Create a todo app with user authentication, real-time updates, and mobile responsive design..."
                  className="w-full h-40 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-900 placeholder-slate-400"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Analyze Project
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* AI Analysis */}
            {result.aiAnalysis && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-slate-900">AI Analysis</h2>
                </div>
                <p className="text-slate-700 leading-relaxed">{result.aiAnalysis}</p>
              </div>
            )}

            {/* Tasks by Category */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Generated Tasks</h2>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-semibold text-sm">
                  {result.tasks.length} Tasks
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {result.tasks.map((task, index) => (
                  <CollapsibleTaskCard key={task.id || index} task={task} index={index} />
                ))}
              </div>
            </div>

            {/* Generated Code */}
            {result.generatedFiles && result.generatedFiles.length > 0 && (
              <CodeViewer
                files={result.generatedFiles}
                projectDescription={prompt}
              />
            )}

            {/* Execution Plan */}
            {result.executionPlan && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Execution Plan</h2>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{result.executionPlan}</p>
              </div>
            )}

            {/* AI Insights */}
            {result.aiInsights && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-slate-900">AI Insights</h2>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{result.aiInsights}</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !result && !error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6">
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Transform Your Ideas</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Enter your project description above and let AI break it down into actionable technical tasks with priorities and estimates.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-600">
            Powered by <span className="font-semibold text-indigo-600">Google Gemini AI</span> • Built with Next.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
