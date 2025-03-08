'use client';

import React, { useState } from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';

interface BatchTestPanelProps {
  onBatchTest: (acceptStrings: string[], rejectStrings: string[]) => {
    passed: boolean;
    acceptResults: { string: string; accepted: boolean; expected: boolean }[];
    rejectResults: { string: string; accepted: boolean; expected: boolean }[];
    summary: string;
  };
}

const BatchTestPanel: React.FC<BatchTestPanelProps> = ({ onBatchTest }) => {
  const { isDarkMode } = useTheme();
  const [acceptStrings, setAcceptStrings] = useState<string>('');
  const [rejectStrings, setRejectStrings] = useState<string>('');
  const [results, setResults] = useState<{
    passed: boolean;
    acceptResults: { string: string; accepted: boolean; expected: boolean }[];
    rejectResults: { string: string; accepted: boolean; expected: boolean }[];
    summary: string;
  } | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse comma-separated strings
    const acceptArray = acceptStrings
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    
    const rejectArray = rejectStrings
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    
    // Run the batch test
    const testResults = onBatchTest(acceptArray, rejectArray);
    setResults(testResults);
    setShowResults(true);
  };

  return (
    <DraggablePanel
      title="Batch Test DFA"
      initialPosition={{ x: 800, y: 150 }}
      initialWidth={400}
      initialHeight={450}
      isDarkMode={isDarkMode}
    >
      <div className={`p-4 overflow-y-auto ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Strings to Accept (comma-separated):
            </label>
            <textarea
              className={`w-full h-20 p-2 border rounded ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              value={acceptStrings}
              onChange={(e) => setAcceptStrings(e.target.value)}
              placeholder="e.g. 0, 101, 111"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Strings to Reject (comma-separated):
            </label>
            <textarea
              className={`w-full h-20 p-2 border rounded ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              value={rejectStrings}
              onChange={(e) => setRejectStrings(e.target.value)}
              placeholder="e.g. 01, 100, 110"
            />
          </div>
          
          <button
            type="submit"
            className={`px-4 py-2 font-bold rounded ${
              isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Run Batch Test
          </button>
        </form>
        
        {showResults && results && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Results:</h3>
            <div
              className={`p-3 mb-4 rounded ${
                results.passed
                  ? isDarkMode
                    ? 'bg-green-800 text-white'
                    : 'bg-green-100 text-green-800'
                  : isDarkMode
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
                      <li key={`accept-${idx}`} className="text-red-500">
                        "{result.string}" should be accepted but was rejected
                      </li>
                    ))}
                  {results.rejectResults
                    .filter((r) => r.accepted)
                    .map((result, idx) => (
                      <li key={`reject-${idx}`} className="text-red-500">
                        "{result.string}" should be rejected but was accepted
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

export default BatchTestPanel; 