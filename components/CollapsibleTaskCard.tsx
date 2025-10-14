'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, GitBranch, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

// Utility function to safely convert any value to string and clean markdown
const safeToString = (value: any): string => {
  let text = '';

  if (typeof value === 'string') {
    text = value;
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    text = String(value);
  } else if (value === null || value === undefined) {
    return '';
  } else if (typeof value === 'object') {
    // If it's an object with a 'text' or 'content' property, use that
    if (value.text) text = String(value.text);
    else if (value.content) text = String(value.content);
    else if (value.description) text = String(value.description);
    else {
      // Otherwise try JSON stringify
      try {
        text = JSON.stringify(value);
      } catch {
        text = String(value);
      }
    }
  } else {
    text = String(value);
  }

  // Clean markdown formatting
  return text
    // Remove bold (**text** or __text__)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Remove italic (*text* or _text_)
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove code blocks (```text```)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove headers (# ## ### etc)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove links [text](url)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Clean up extra whitespace
    .trim();
};

// Format description with proper paragraphs and bullet points
const formatDescription = (text: string): JSX.Element => {
  if (!text) return <></>;

  const lines = text.split('\n').filter(line => line.trim());

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmedLine = line.trim();

        // Check if it's a bullet point (starts with •, *, -, or number.)
        if (trimmedLine.match(/^[•\*\-]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
          const content = trimmedLine.replace(/^[•\*\-]\s+/, '').replace(/^\d+\.\s+/, '');
          return (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-indigo-500 mt-1">•</span>
              <span className="flex-1 text-slate-700">{content}</span>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-slate-700 leading-relaxed">
            {trimmedLine}
          </p>
        );
      })}
    </div>
  );
};

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

interface CollapsibleTaskCardProps {
  task: Task;
  index: number;
  defaultExpanded?: boolean;
}

const getCategoryColor = (type: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    frontend: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-700', 
      border: 'border-blue-200' 
    },
    backend: { 
      bg: 'bg-purple-50', 
      text: 'text-purple-700', 
      border: 'border-purple-200' 
    },
    database: { 
      bg: 'bg-green-50', 
      text: 'text-green-700', 
      border: 'border-green-200' 
    },
    testing: { 
      bg: 'bg-orange-50', 
      text: 'text-orange-700', 
      border: 'border-orange-200' 
    },
    deployment: { 
      bg: 'bg-red-50', 
      text: 'text-red-700', 
      border: 'border-red-200' 
    },
    devops: { 
      bg: 'bg-cyan-50', 
      text: 'text-cyan-700', 
      border: 'border-cyan-200' 
    },
    general: { 
      bg: 'bg-gray-50', 
      text: 'text-gray-700', 
      border: 'border-gray-200' 
    },
  };
  return colors[type.toLowerCase()] || colors.general;
};

const getPriorityStyle = (priority: string) => {
  const styles: Record<string, { bg: string; text: string; icon: string }> = {
    high: { 
      bg: 'bg-red-100', 
      text: 'text-red-700',
      icon: '🔴'
    },
    medium: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-700',
      icon: '🟡'
    },
    low: { 
      bg: 'bg-green-100', 
      text: 'text-green-700',
      icon: '🟢'
    },
  };
  return styles[priority.toLowerCase()] || styles.low;
};

export default function CollapsibleTaskCard({ task, index, defaultExpanded = false }: CollapsibleTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const categoryStyle = getCategoryColor(task.type);
  const priorityStyle = getPriorityStyle(task.priority);

  return (
    <div className={`border-2 ${categoryStyle.border} rounded-xl bg-white transition-all duration-300 hover:shadow-lg overflow-hidden`}>
      {/* Collapsed Header - Always Visible */}
      <div 
        className={`p-4 cursor-pointer select-none ${categoryStyle.bg} hover:opacity-90 transition-opacity`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title and Number */}
            <div className="flex items-start gap-2 mb-2">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/80 text-xs font-bold text-slate-700 shadow-sm">
                {index + 1}
              </span>
              <h3 className={`font-semibold text-base leading-tight ${categoryStyle.text} break-words pr-2`}>
                {safeToString(task.title)}
              </h3>
            </div>
            
            {/* Tags Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Priority Badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                <span className="text-[10px]">{priorityStyle.icon}</span>
                {task.priority.toUpperCase()}
              </span>
              
              {/* Type Badge */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/70 ${categoryStyle.text}`}>
                {task.type.toUpperCase()}
              </span>
              
              {/* Time Estimate if exists */}
              {task.estimatedHours && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white/70 text-slate-600">
                  <Clock className="w-3 h-3" />
                  {task.estimatedHours}h
                </span>
              )}
              
              {/* Dependencies indicator */}
              {task.dependencies && task.dependencies.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  <GitBranch className="w-3 h-3" />
                  {task.dependencies.length}
                </span>
              )}
            </div>
          </div>
          
          {/* Expand/Collapse Icon */}
          <div className="flex-shrink-0 mt-1">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4 border-t border-slate-100 space-y-4">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Description</h4>
            <div className="text-sm">
              {formatDescription(safeToString(task.description))}
            </div>
          </div>

          {/* Dependencies */}
          {task.dependencies && task.dependencies.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                Dependencies
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.dependencies.map((dep, i) => (
                  <span key={i} className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-md text-xs font-medium">
                    {safeToString(dep)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Acceptance Criteria */}
          {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Acceptance Criteria
              </h4>
              <ul className="space-y-2">
                {task.acceptance_criteria.map((criteria, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{safeToString(criteria)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
