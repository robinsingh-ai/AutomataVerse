'use client';

import { useState, useEffect } from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';
import { Problem } from '../problemsets/problems';
import { NodeMap } from '../type';

interface ProblemPanelProps {
  problem: Problem;
  onTestSolution: (testString: string) => string;
  onBatchTest: () => {
    passed: number;
    total: number;
    results: { input: string; expectedOutput: string; actualOutput: string; passed: boolean }[];
  };
  isLoading: boolean;
}

const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problem,
  onTestSolution,
  onBatchTest,
  isLoading
}) => {
  const { theme } = useTheme();
  const [batchResults, setBatchResults] = useState<{
    passed: number;
    total: number;
    results: { input: string; expectedOutput: string; actualOutput: string; passed: boolean }[];
  } | null>(null);

  // Handler to run batch tests
  const handleBatchTest = () => {
    const results = onBatchTest();
    setBatchResults(results);
  };

  return (
    <DraggablePanel title="Problem" defaultPosition={{ x: 400, y: 80 }}>
      <div className="space-y-4 max-w-lg">
        {/* Problem Title */}
        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {problem.title}
        </h2>
        
        {/* Machine Type Badge */}
        <div className="flex items-center">
          <span 
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              problem.machineType === 'Moore' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
            }`}
          >
            {problem.machineType} Machine
          </span>
          <span 
            className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
              problem.difficulty === 'easy' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                : problem.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </span>
        </div>
        
        {/* Problem Description */}
        <div className={`py-2 px-3 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {problem.description}
          </p>
        </div>
        
        {/* Batch Test */}
        <div className="pt-2">
          <button
            onClick={handleBatchTest}
            disabled={isLoading}
            className={`w-full py-2 px-4 font-medium rounded ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Run All Tests
          </button>
          
          {batchResults && (
            <div className="mt-4 space-y-3">
              <div className={`p-3 rounded-t ${
                batchResults.passed === batchResults.total
                  ? theme === 'dark' ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
                  : theme === 'dark' ? 'bg-yellow-800 text-yellow-100' : 'bg-yellow-100 text-yellow-800'
              }`}>
                <span className="font-medium">
                  {batchResults.passed} / {batchResults.total} tests passed
                </span>
              </div>
              
              <div className={`max-h-60 overflow-y-auto p-2 rounded-b ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
              }`}>
                {batchResults.results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-2 mb-2 text-sm rounded ${
                      result.passed
                        ? theme === 'dark' ? 'bg-green-900 text-green-100' : 'bg-green-50 text-green-800 border border-green-200'
                        : theme === 'dark' ? 'bg-red-900 text-red-100' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">Input:</span> {result.input}
                      </div>
                      <div>
                        <span className="font-medium">Expected:</span> {result.expectedOutput}
                      </div>
                      <div>
                        <span className="font-medium">Actual:</span> {result.actualOutput}
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          result.passed 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DraggablePanel>
  );
};

export default ProblemPanel; 