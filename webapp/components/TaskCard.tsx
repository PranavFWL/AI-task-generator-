import { CheckCircle2, Clock, GitBranch } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  type: string;
  priority: string;
  description: string;
  estimatedHours?: number;
  dependencies?: string[];
  acceptance_criteria: string[];
}

interface TaskCardProps {
  task: Task;
  index: number;
}

const getCategoryColor = (type: string) => {
  const colors: Record<string, string> = {
    frontend: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    backend: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    database: 'bg-green-500/10 text-green-600 border-green-500/20',
    testing: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    deployment: 'bg-red-500/10 text-red-600 border-red-500/20',
    devops: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    general: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  };
  return colors[type.toLowerCase()] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    high: 'bg-red-500/10 text-red-700 border-red-500/30',
    medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
    low: 'bg-green-500/10 text-green-700 border-green-500/30',
  };
  return colors[priority.toLowerCase()] || 'bg-gray-500/10 text-gray-700 border-gray-500/30';
};

export default function TaskCard({ task, index }: TaskCardProps) {
  return (
    <div className="border-2 border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-indigo-300 group bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1.5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-700 font-mono text-sm rounded-lg font-bold">
              #{index + 1}
            </span>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
              {task.title}
            </h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-[15px]">{task.description}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className={`px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider ${getCategoryColor(task.type)}`}>
          {task.type}
        </span>
        <span className={`px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
          {task.priority} Priority
        </span>
        {task.estimatedHours && (
          <span className="px-3 py-2 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {task.estimatedHours}h estimate
          </span>
        )}
      </div>

      {/* Dependencies */}
      {task.dependencies && task.dependencies.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-amber-700" />
            <p className="text-xs text-amber-900 font-bold uppercase tracking-wider">Dependencies</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {task.dependencies.map((dep, i) => (
              <span key={i} className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 rounded-lg text-xs font-semibold">
                {dep}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Acceptance Criteria */}
      {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <p className="text-xs text-green-900 font-bold uppercase tracking-wider">Acceptance Criteria</p>
          </div>
          <ul className="space-y-2.5">
            {task.acceptance_criteria.map((criteria, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 group/item">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                </div>
                <span className="leading-relaxed">{criteria}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
