import React, { useState } from 'react';
import { useTheme } from '../../../app/context/ThemeContext';
import DraggablePanel from './DraggablePanel';
import { NFA_PROBLEMS } from '../problemsets/problems';

interface ProblemPanelProps {
  problemId: string;
  onTestSolution: (acceptStrings: string[], rejectStrings: string[]) => {
    passed: boolean;
    acceptResults: { string: string; accepted: boolean; expected: boolean }[];
    rejectResults: { string: string; accepted: boolean; expected: boolean }[];
    summary: string;
  };
}

const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problemId,
  onTestSolution,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [results, setResults] = useState<{
    passed: boolean;
    acceptResults: { string: string; accepted: boolean; expected: boolean }[];
    rejectResults: { string: string; accepted: boolean; expected: boolean }[];
    summary: string;
  } | null>(null);

  // Get problem data from our problems collection
  const problem = NFA_PROBLEMS[problemId];
  
  if (!problem) {
    return (
      <DraggablePanel title="Unknown Problem" width={400}>
        <div className={`p-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <p>Could not find problem with ID: {problemId}</p>
        </div>
      </DraggablePanel>
    );
  }

  const handleTestSolution = () => {
    const testResults = onTestSolution(problem.accept, problem.reject);
    setResults(testResults);
  };

  return (
    <DraggablePanel title={`Problem: ${problem.title}`} width={400}>
      <div className={`p-4 ${isDark ? 'text-white' : 'text-gray-800'} max-h-[500px] overflow-y-auto`}>
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Description:</h3>
          <p className="mb-4">{problem.description}</p>
          
          <h3 className="font-bold text-lg mb-2">Test Cases:</h3>
          <div className="mb-2">
            <h4 className="font-semibold">These strings should be accepted:</h4>
            <div className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {problem.accept.join(', ')}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold">These strings should be rejected:</h4>
            <div className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {problem.reject.join(', ')}
            </div>
          </div>
          
          <button
            onClick={handleTestSolution}
            className={`px-4 py-2 font-bold rounded ${
              isDark
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Test Your Solution
          </button>
        </div>
        
        {results && (
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">Results:</h3>
            <div
              className={`p-3 mb-4 rounded ${
                results.passed
                  ? isDark
                    ? 'bg-green-800 text-white'
                    : 'bg-green-100 text-green-800'
                  : isDark
                  ? 'bg-red-800 text-white'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {results.summary}
            </div>
            
            {!results.passed && (
              <div>
                <h4 className="font-semibold mt-3">Failed Tests:</h4>
                <ul className="list-disc pl-5">
                  {results.acceptResults
                    .filter((r) => !r.accepted)
                    .map((result, idx) => (
                      <li key={`accept-${idx}`} className={isDark ? "text-red-400" : "text-red-600"}>
                        &quot;{result.string}&quot; should be accepted but was rejected
                      </li>
                    ))}
                  {results.rejectResults
                    .filter((r) => r.accepted)
                    .map((result, idx) => (
                      <li key={`reject-${idx}`} className={isDark ? "text-red-400" : "text-red-600"}>
                        &quot;{result.string}&quot; should be rejected but was accepted
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default ProblemPanel; 