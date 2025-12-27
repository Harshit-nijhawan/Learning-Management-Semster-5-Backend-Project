import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Send, RefreshCw, Settings, Maximize2, Sparkles } from "lucide-react";

// Language boilerplate/templates
const BOILERPLATES = {
    javascript: `function solution(nums) {\n  // Write your code here\n  console.log("Hello World");\n  return nums;\n}`,
    python: `def solution(nums):\n    # Write your code here\n    print("Hello from Python")\n    return nums\n`,
    java: `public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello Java");\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    cout << "Hello C++" << endl;\n    return 0;\n}`,
    c: `#include <stdio.h>\n\nint main() {\n    // Write your code here\n    printf("Hello C\\n");\n    return 0;\n}`
};

const CodeEditor = ({
    code,
    setCode,
    language,
    setLanguage,
    onRun,
    onSubmit,
    isRunning,
    isSubmitting,
    onAudit,
    isAuditing
}) => {
    const editorRef = useRef(null);
    const [theme, setTheme] = useState("vs-dark");

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        // Only set boilerplate if code is empty or default
        if (!code || code === BOILERPLATES[language]) {
            setCode(BOILERPLATES[newLang]);
        }
    };

    const resetCode = () => {
        if (confirm("Reset code to default template?")) {
            setCode(BOILERPLATES[language]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden shadow-2xl">
            {/* Editor Toolbar */}
            <div className="bg-[#252526] px-4 py-3 flex items-center justify-between border-b border-[#333]">
                <div className="flex items-center gap-3">
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="bg-[#3c3c3c] text-gray-200 text-sm px-3 py-1.5 rounded border border-[#555] focus:outline-none focus:border-blue-500 font-mono"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                    </select>

                    <button
                        onClick={resetCode}
                        title="Reset Code"
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3c3c3c] rounded transition"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
                        className="text-xs text-gray-400 hover:text-white"
                    >
                        {theme === "vs-dark" ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                <Editor
                    height="100%"
                    language={language === "c" || language === "cpp" ? "cpp" : language}
                    value={code}
                    theme={theme}
                    onChange={(value) => setCode(value)}
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
                    }}
                />
            </div>

            {/* Action Bar */}
            <div className="bg-[#252526] px-4 py-3 border-t border-[#333] flex justify-between items-center">
                <div className="text-xs text-gray-500 font-mono">
                    Line {editorRef.current?.getPosition()?.lineNumber || 1}, Col {editorRef.current?.getPosition()?.column || 1}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onAudit}
                        disabled={isRunning || isSubmitting || isAuditing}
                        className={`flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold transition-all border ${isAuditing
                                ? "bg-purple-900/50 border-purple-500 text-purple-300 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-500 text-white border-purple-500 shadow-lg hover:shadow-purple-900/20"
                            }`}
                        title="Get Senior Engineer Feedback"
                    >
                        <Sparkles size={16} className={isAuditing ? "animate-spin" : ""} />
                        {isAuditing ? "Auditing..." : "Get Audit"}
                    </button>

                    <button
                        onClick={onRun}
                        disabled={isRunning || isSubmitting}
                        className={`flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold transition-all ${isRunning
                            ? "bg-gray-600 cursor-not-allowed opacity-50"
                            : "bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white border border-[#555]"
                            }`}
                    >
                        <Play size={16} className={isRunning ? "animate-pulse" : ""} />
                        {isRunning ? "Running..." : "Run Code"}
                    </button>

                    <button
                        onClick={onSubmit}
                        disabled={isRunning || isSubmitting}
                        className={`flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold transition-all shadow-lg hover:shadow-green-900/20 active:scale-95 ${isSubmitting
                            ? "bg-green-700 cursor-not-allowed opacity-50"
                            : "bg-green-600 hover:bg-green-500 text-white"
                            }`}
                    >
                        <Send size={16} />
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
