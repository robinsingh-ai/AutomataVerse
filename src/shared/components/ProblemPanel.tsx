'use client';

import React, { useState } from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../app/context/ThemeContext';

export interface Problem {
  id: string;
  title: string;
  description: string;
  accept: string[];
  reject: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  instructions?: string;
}

export interface TestResult {
  passed: boolean;
  acceptResults: { string: string; accepted: boolean; expected: boolean }[];
  rejectResults: { string: string; accepted: boolean; expected: boolean }[];
  summary: string;
}

interface ProblemPanelProps {
  problem: Problem;
  simulatorType: 'DFA' | 'NFA' | 'PDA' | 'TM' | 'FSM';
  onTestSolution: (acceptStrings: string[], rejectStrings: string[]) => TestResult;
  onClose?: () => void;
  width?: number;
}

const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problem,
  simulatorType,
  onTestSolution,
  onClose,
  width = 380
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [results, setResults] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestSolution = async () => {
    setIsLoading(true);
    try {
      const testResults = onTestSolution(problem.accept, problem.reject);
      setResults(testResults);
    } catch (error) {
      console.error('Error testing solution:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'Medium':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'Hard':
        return isDark ? 'text-red-400' : 'text-red-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return isDark ? 'bg-green-900/20' : 'bg-green-100';
      case 'Medium':
        return isDark ? 'bg-yellow-900/20' : 'bg-yellow-100';
      case 'Hard':
        return isDark ? 'bg-red-900/20' : 'bg-red-100';
      default:
        return isDark ? 'bg-gray-800' : 'bg-gray-100';
    }
  };

  return (
    <DraggablePanel 
      title={`${simulatorType} Problem: ${problem.title}`} 
      defaultPosition={{ x: window.innerWidth - 400, y: 400 }}
      width={width}
    >
      <div className={`${isDark ? 'text-white' : 'text-gray-800'} max-h-[600px] overflow-y-auto`}>
        <div className="space-y-4">
          {/* Problem Header */}
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBg(problem.difficulty)}`}>
              <span className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                aria-label="Close problem panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Problem Description */}
          <div>
            <h3 className="font-bold text-lg mb-2">Description</h3>
            <p className="mb-4 leading-relaxed">{problem.description}</p>
            
            {problem.instructions && (
              <div className={`p-3 rounded ${isDark ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'} mb-4`}>
                <p className="text-sm">{problem.instructions}</p>
              </div>
            )}
          </div>

          {/* Test Cases */}
          <div>
            <h3 className="font-bold text-lg mb-3">Test Cases</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Accept ({problem.accept.length} strings)
                </h4>
                <div className={`p-3 rounded font-mono text-sm ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {problem.accept.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {problem.accept.map((str, idx) => (
                        <span key={idx} className={`px-2 py-1 rounded ${isDark ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'}`}>
                          "{str}"
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No accept strings</span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject ({problem.reject.length} strings)
                </h4>
                <div className={`p-3 rounded font-mono text-sm ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {problem.reject.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {problem.reject.map((str, idx) => (
                        <span key={idx} className={`px-2 py-1 rounded ${isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'}`}>
                          "{str}"
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No reject strings</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={handleTestSolution}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
                isLoading
                  ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                  : isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-green-300'
                    : 'bg-white hover:bg-gray-100 text-green-600 hover:text-green-700 border border-gray-300'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Test Your Solution</span>
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
              <h3 className="font-bold text-lg mb-3">Results</h3>
              <div
                className={`p-4 mb-4 rounded-lg flex items-start gap-3 ${
                  results.passed
                    ? isDark
                      ? 'bg-green-900/20 text-green-200 border border-green-800'
                      : 'bg-green-50 text-green-800 border border-green-200'
                    : isDark
                    ? 'bg-red-900/20 text-red-200 border border-red-800'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${results.passed ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {results.passed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span className="font-medium">{results.summary}</span>
              </div>

              {!results.passed && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-500">Failed Tests:</h4>
                  <ul className="space-y-1 text-sm">
                    {results.acceptResults
                      .filter((r) => !r.accepted)
                      .map((result, idx) => (
                        <li key={`accept-${idx}`} className={isDark ? "text-red-400" : "text-red-600"}>
                          • "{result.string}" should be <strong>accepted</strong> but was <strong>rejected</strong>
                        </li>
                      ))}
                    {results.rejectResults
                      .filter((r) => r.accepted)
                      .map((result, idx) => (
                        <li key={`reject-${idx}`} className={isDark ? "text-red-400" : "text-red-600"}>
                          • "{result.string}" should be <strong>rejected</strong> but was <strong>accepted</strong>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DraggablePanel>
  );
};

export default ProblemPanel;
