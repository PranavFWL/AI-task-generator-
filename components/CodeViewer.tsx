'use client';

import { useState } from 'react';
import { Download, FileCode, Copy, Check, Loader2 } from 'lucide-react';
import JSZip from 'jszip';

interface GeneratedFile {
  path: string;
  content: string;
  type: string;
}

interface CodeViewerProps {
  files: GeneratedFile[];
  projectDescription?: string;
}

export default function CodeViewer({ files, projectDescription = 'My Project' }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(files[0] || null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyCode = async () => {
    if (selectedFile) {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const extractProjectName = (description: string): string => {
    // Extract name from phrases like "Build a todo app"
    const match = description.match(/(?:build|create|develop|make)\s+(?:a|an)\s+([\w\s-]+?)(?:\s+with|\s+that|\s+for|$)/i);
    if (match && match[1]) {
      return match[1].trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('-');
    }

    // Fallback to first few words
    return description.split(' ').slice(0, 3).join('-').toLowerCase();
  };

  const handleDownloadAll = async () => {
    setDownloading(true);

    try {
      const projectName = extractProjectName(projectDescription);
      const { ProjectGenerator } = await import('@/lib/projectGenerator');

      // Generate complete project structure
      const projectFiles = ProjectGenerator.generateProjectStructure(
        files,
        projectName,
        projectDescription
      );

      // Create ZIP file
      const zip = new JSZip();

      // Add all files to ZIP
      projectFiles.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Generate ZIP blob
      const blob = await zip.generateAsync({ type: 'blob' });

      // Download ZIP
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('Failed to generate project ZIP. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadFile = () => {
    if (!selectedFile) return;

    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.path.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (files.length === 0) {
    return null;
  }

  const filesByType = files.reduce((acc, file) => {
    if (!acc[file.type]) {
      acc[file.type] = [];
    }
    acc[file.type].push(file);
    return acc;
  }, {} as Record<string, GeneratedFile[]>);

  const getFileIcon = (type: string) => {
    const colors = {
      component: 'text-blue-600',
      api: 'text-purple-600',
      schema: 'text-green-600',
      config: 'text-orange-600',
      other: 'text-gray-600',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      component: 'Frontend',
      api: 'API',
      schema: 'Database',
      config: 'Config',
      other: 'Other',
    };
    return labels[type as keyof typeof labels] || 'Other';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileCode className="w-6 h-6 text-white" />
          <div>
            <h2 className="text-xl font-bold text-white">Generated Code</h2>
            <p className="text-blue-100 text-sm">{files.length} files generated</p>
          </div>
        </div>
        <button
          onClick={handleDownloadAll}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating ZIP...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download ZIP
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-[600px] lg:h-[700px]">
        {/* File Tree Sidebar - Always visible */}
        <div className="w-full lg:w-80 lg:max-w-[320px] border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto bg-slate-50 flex-shrink-0 max-h-[300px] lg:max-h-full">
          <div className="sticky top-0 bg-slate-100 px-4 py-3 border-b border-slate-200 z-10">
            <h3 className="font-semibold text-slate-900 text-sm">
              Files ({files.length})
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {Object.entries(filesByType).map(([type, typeFiles]) => (
              <div key={type}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${getFileIcon(type).replace('text-', 'bg-')}`} />
                  <h3 className="font-semibold text-sm text-slate-700 uppercase tracking-wide">
                    {getTypeLabel(type)}
                  </h3>
                  <span className="text-xs text-slate-500">({typeFiles.length})</span>
                </div>
                <div className="space-y-1 ml-4">
                  {typeFiles.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedFile?.path === file.path
                          ? 'bg-indigo-100 text-indigo-900 font-medium'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileCode className={`w-4 h-4 ${getFileIcon(file.type)}`} />
                        <span className="truncate">{file.path.split('/').pop()}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 ml-6 truncate">
                        {file.path}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Display */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedFile ? (
            <>
              {/* File Header */}
              <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-200 bg-slate-50 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <FileCode className={`w-5 h-5 ${getFileIcon(selectedFile.type)}`} />
                  <div>
                    <p className="font-mono text-sm font-medium text-slate-900">
                      {selectedFile.path}
                    </p>
                    <p className="text-xs text-slate-600">
                      {selectedFile.content.split('\n').length} lines • {getTypeLabel(selectedFile.type)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadFile}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="flex-1 overflow-auto bg-slate-900 p-4 md:p-6">
                <pre className="text-xs md:text-sm text-slate-100 font-mono leading-relaxed whitespace-pre-wrap break-words">
                  <code>{selectedFile.content}</code>
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a file to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
