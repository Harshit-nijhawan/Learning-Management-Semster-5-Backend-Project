import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Split from "react-split";  // Need to install react-split if not present, otherwise use simple flex
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock, Terminal, Sparkles, ShieldCheck } from "lucide-react";
import CodeEditor from "../components/CodeEditor";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const ProblemSolver = () => {
    const { slug } = useParams(); // Should use slug or id
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);

    // Editor State
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState(null);

    // Output State
    const [output, setOutput] = useState(null);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        // Determine if slug is actually an ID or slug
        // Assuming backend supports both or we use ID for now. 
        // Ideally we fetch by ID if slug not available.
        // For now, let's assume the route passes an ID
        fetchProblem();
    }, [slug]);

    const fetchProblem = async () => {
        try {
            // If slug is ObjectId, use getById, else getBySlug
            // Simplifying: try getting by slug first
            const res = await api.get(`/api/problems/${slug}`);
            setProblem(res.data);
            // Initialize code template based on language
            // Here we could load user's last saved code draft
            setCode(`// Write your solution for ${res.data.title} here...`);
        } catch (error) {
            console.error("Failed to load problem", error);
            // Handle 404
        } finally {
            setLoading(false);
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setActiveTab("output");
        try {
            const res = await api.post(`/api/problems/${problem._id}/run`, {
                code,
                language
            });
            setOutput({ type: 'run', data: res.data });
        } catch (error) {
            setOutput({ type: 'error', data: error.response?.data?.message || "Execution failed" });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setActiveTab("output");
        try {
            const res = await api.post(`/api/problems/${problem._id}/submit`, {
                code,
                language
            });
            setOutput({ type: 'submit', data: res.data });
        } catch (error) {
            setOutput({ type: 'error', data: error.response?.data?.message || "Submission failed" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAudit = async () => {
        setIsAuditing(true);
        setActiveTab("audit");
        try {
            const res = await api.post(`/api/problems/${problem._id || problem.slug}/audit`, {
                code,
                language
            });
            setAuditResult(res.data);
        } catch (error) {
            setAuditResult({ error: "Failed to generate audit. Please try again." });
        } finally {
            setIsAuditing(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#1e1e1e] text-white">Loading IDE...</div>;
    if (!problem) return <div className="h-screen flex items-center justify-center text-white">Problem not found</div>;

    return (
        <div className="flex flex-col h-screen bg-[#1e1e1e] text-white overflow-hidden">
            {/* Header */}
            <div className="h-14 bg-[#252526] border-b border-[#333] flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-1 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-sm md:text-base leading-tight">{problem.title}</h1>
                        <span className="text-xs text-gray-500 font-mono">ID: {problem._id.slice(-6)}</span>
                    </div>
                </div>
                {/* Can add timer or other header items here */}
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Problem Description */}
                <div className="w-1/2 md:w-5/12 border-r border-[#333] flex flex-col bg-[#1e1e1e]">
                    {/* Tabs */}
                    <div className="flex bg-[#252526] border-b border-[#333]">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'description' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'output' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
                        >
                            <Terminal size={14} className="inline mr-1.5" />
                            Output
                        </button>
                        <button
                            onClick={() => setActiveTab('audit')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'audit'
                                ? 'border-purple-500 text-purple-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            <Sparkles size={14} />
                            AI Audit
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#333]">
                        {activeTab === 'description' && (
                            <div className="prose prose-invert prose-sm max-w-none">
                                <h2 className="text-xl font-bold mb-4">{problem.title}</h2>
                                <div className="flex gap-2 mb-4">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
                                        problem.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                                            'bg-red-900/50 text-red-400'
                                        }`}>{problem.difficulty}</span>
                                </div>

                                <div className="whitespace-pre-wrap text-gray-300 leading-relaxed font-sans mb-6">
                                    {problem.description}
                                </div>

                                {/* Examples */}
                                {problem.sampleTestCases?.map((tc, i) => (
                                    <div key={i} className="mb-4 bg-[#2d2d2d] rounded-lg p-4 font-mono text-sm border border-[#444]">
                                        <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider">Example {i + 1}</p>
                                        <div className="mb-2">
                                            <span className="text-blue-400 font-bold select-none">Input: </span>
                                            <span className="text-gray-300">{tc.input}</span>
                                        </div>
                                        <div>
                                            <span className="text-blue-400 font-bold select-none">Output: </span>
                                            <span className="text-gray-300">{tc.output}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'output' && (
                            // Output / Result Panel
                            <div className="font-mono text-sm h-full">
                                {!output && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                        <Terminal size={48} className="mb-4" />
                                        <p>Run or Submit code to see results</p>
                                    </div>
                                )}

                                {output?.type === 'run' && (
                                    <div>
                                        <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${output.data.allPassed ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'
                                            }`}>
                                            {output.data.allPassed ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                                            <div>
                                                <h3 className={`font-bold ${output.data.allPassed ? 'text-green-400' : 'text-red-400'}`}>
                                                    {output.data.verdict}
                                                </h3>
                                                <p className="text-xs text-gray-400">Sample Test Cases</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {output.data.results.map((res, idx) => (
                                                <div key={idx} className="bg-[#2d2d2d] rounded p-3 border-l-4 border-[#444]"
                                                    style={{ borderLeftColor: res.passed ? '#22c55e' : '#ef4444' }}
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-gray-400 uppercase">Case {res.testCaseId}</span>
                                                        <span className={`text-xs ${res.passed ? 'text-green-400' : 'text-red-400'}`}>
                                                            {res.passed ? 'Passed' : 'Failed'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <span className="text-gray-500 block">Input</span>
                                                            <code className="bg-black/30 p-1 rounded block mt-1">{res.input}</code>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 block">Expected</span>
                                                            <code className="bg-black/30 p-1 rounded block mt-1">{res.expectedOutput}</code>
                                                        </div>
                                                    </div>
                                                    {!res.passed && (
                                                        <div className="mt-2 text-xs">
                                                            <span className="text-gray-500 block">Actual Output</span>
                                                            <code className="bg-red-900/20 text-red-300 p-1 rounded block mt-1 border border-red-900/50">
                                                                {res.actualOutput}
                                                            </code>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {output?.type === 'submit' && (
                                    <div className="animate-fade-in-up">
                                        <div className={`p-6 rounded-xl mb-6 text-center border ${output.data.verdict === 'Accepted'
                                            ? 'bg-gradient-to-br from-green-900/30 to-green-800/10 border-green-700'
                                            : 'bg-gradient-to-br from-red-900/30 to-red-800/10 border-red-700'
                                            }`}>
                                            {output.data.verdict === 'Accepted' ? (
                                                <CheckCircle size={48} className="mx-auto text-green-500 mb-2" />
                                            ) : (
                                                <XCircle size={48} className="mx-auto text-red-500 mb-2" />
                                            )}
                                            <h2 className={`text-3xl font-bold mb-2 ${output.data.verdict === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                                                {output.data.verdict}
                                            </h2>

                                            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
                                                <div className="flex-col flex items-center">
                                                    <Clock size={16} className="mb-1" />
                                                    <span>{(output.data.timeUsed * 1000).toFixed(0)} ms</span>
                                                </div>
                                                <div className="flex-col flex items-center">
                                                    <div className="font-bold text-white text-lg">{output.data.results.filter(r => r.passed).length}/{output.data.results.length}</div>
                                                    <span>Test Cases</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Test Case Grid for Submission (Hidden inputs maybe) */}
                                        <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Test Case Details</h4>
                                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                            {output.data.results.map((res, idx) => (
                                                <div key={idx}
                                                    className={`h-10 rounded flex items-center justify-center text-xs font-bold cursor-help transition-all hover:scale-105 ${res.passed ? 'bg-green-900/40 text-green-400 border border-green-800' : 'bg-red-900/40 text-red-400 border border-red-800'
                                                        }`}
                                                    title={`Test Case ${idx + 1}: ${res.status} (${(res.time * 1000).toFixed(0)}ms)`}
                                                >
                                                    Top {idx + 1}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {output?.type === 'error' && (
                                    <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 flex items-start gap-3">
                                        <AlertTriangle className="shrink-0 mt-0.5" />
                                        <div className="break-all whitespace-pre-wrap font-mono text-sm">
                                            {typeof output.data === 'string' ? output.data : JSON.stringify(output.data)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'audit' && (
                            // AI Audit Panel
                            <div className="font-sans h-full">
                                {!auditResult ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                                        <ShieldCheck size={48} className="mb-4 text-purple-400" />
                                        <p className="max-w-[200px] text-center">Get a Senior Engineer code review powered by Gemini AI</p>
                                    </div>
                                ) : auditResult.error ? (
                                    <div className="p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-800">
                                        {auditResult.error}
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-fade-in">
                                        {/* Scorecard */}
                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>

                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Overall Grade</h3>
                                                    <div className={`text-4xl font-black ${['A', 'A+'].includes(auditResult.grade) ? 'text-green-400' :
                                                        ['B', 'B+'].includes(auditResult.grade) ? 'text-blue-400' :
                                                            ['C', 'C+'].includes(auditResult.grade) ? 'text-yellow-400' :
                                                                'text-red-400'
                                                        }`}>{auditResult.grade}</div>
                                                </div>
                                                <div className="text-right">
                                                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Quality Score</h3>
                                                    <div className="text-2xl font-bold text-white">{auditResult.qualityScore}/100</div>
                                                </div>
                                            </div>

                                            <p className="text-gray-300 text-sm leading-relaxed border-t border-gray-700 pt-3">
                                                "{auditResult.feedback}"
                                            </p>
                                        </div>

                                        {/* Complexity Analysis */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#444]">
                                                <h4 className="text-xs text-gray-400 uppercase font-bold mb-2">Time Complexity</h4>
                                                <code className="text-blue-400 font-mono text-sm block">{auditResult.timeComplexity}</code>
                                            </div>
                                            <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#444]">
                                                <h4 className="text-xs text-gray-400 uppercase font-bold mb-2">Space Complexity</h4>
                                                <code className="text-purple-400 font-mono text-sm block">{auditResult.spaceComplexity}</code>
                                            </div>
                                        </div>

                                        {/* Suggestions */}
                                        <div className="bg-[#2d2d2d] rounded-lg border border-[#444] overflow-hidden">
                                            <div className="bg-[#333] px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Senior Engineer Feedback
                                            </div>
                                            <div className="p-4 space-y-3">
                                                {auditResult.suggestions.map((suggestion, idx) => (
                                                    <div key={idx} className="flex gap-3 text-sm text-gray-300">
                                                        <span className="shrink-0 w-5 h-5 rounded-full bg-purple-900/50 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-800">
                                                            {idx + 1}
                                                        </span>
                                                        <span>{suggestion}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Code Editor */}
                <div className="flex-1 bg-[#1e1e1e]">
                    <CodeEditor
                        code={code}
                        setCode={setCode}
                        language={language}
                        setLanguage={setLanguage}
                        onRun={handleRun}
                        onSubmit={handleSubmit}
                        isRunning={isRunning}
                        isSubmitting={isSubmitting}
                        onAudit={handleAudit}
                        isAuditing={isAuditing}
                    />
                </div>
            </div>
        </div >
    );
};

export default ProblemSolver;
