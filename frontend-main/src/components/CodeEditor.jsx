import React, { useState } from 'react';
import { Play, RotateCcw, Save, Upload } from 'lucide-react';

/**
 * Simple in-browser code editor component for GFG-style coding problems
 * For production, consider using Monaco Editor (@monaco-editor/react) or CodeMirror
 */
function CodeEditor({ 
  initialCode = '', 
  language = 'python', 
  onRunCode, 
  onSubmit,
  readOnly = false 
}) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'c', label: 'C' }
  ];

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      // In production, integrate with Judge0 API or your own code execution service
      // For now, just simulate execution
      setTimeout(() => {
        if (onRunCode) {
          onRunCode(code, selectedLanguage);
        }
        setOutput('Code executed successfully!\n\nSample Output:\nHello, World!');
        setIsRunning(false);
      }, 1000);
    } catch (error) {
      setOutput('Error: ' + error.message);
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(code, selectedLanguage);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Code Editor</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded text-sm outline-none"
            disabled={readOnly}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
            disabled={readOnly || isRunning}
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={handleRunCode}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
            disabled={isRunning}
          >
            <Play size={14} />
            {isRunning ? 'Running...' : 'Run'}
          </button>
          {onSubmit && (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
              disabled={isRunning}
            >
              <Upload size={14} />
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Editor */}
        <div className="flex-1 relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-white resize-none outline-none"
            style={{ minHeight: '300px' }}
            placeholder="Write your code here..."
            readOnly={readOnly}
            spellCheck="false"
          />
          {readOnly && (
            <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
              Read Only
            </div>
          )}
        </div>

        {/* Output Panel */}
        {output && (
          <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-900 text-gray-100">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 font-semibold text-sm">
              Output
            </div>
            <pre className="p-4 text-sm font-mono whitespace-pre-wrap overflow-auto" style={{ maxHeight: '300px' }}>
              {output}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 border-t border-gray-200">
        <span>💡 Tip: Use Ctrl+Enter to run code • Ctrl+S to save</span>
      </div>
    </div>
  );
}

export default CodeEditor;
