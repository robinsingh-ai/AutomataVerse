'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  type: string;
}

export default function TestPDAPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProblems() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/problems');
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();
        console.log('API Response:', data);
        
        // Filter only PDA problems
        const pdaProblems = data.problems.filter((p: Problem) => p.type === 'pda');
        setProblems(pdaProblems);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProblems();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">PDA Problems Test Page</h1>
      
      {isLoading ? (
        <p>Loading problems...</p>
      ) : (
        <>
          <p className="mb-4">Found {problems.length} PDA problems</p>
          
          <div className="grid gap-4">
            {problems.map((problem) => (
              <div key={problem.id} className="border p-4 rounded">
                <h2 className="text-xl font-bold">{problem.title}</h2>
                <p className="my-2">{problem.description}</p>
                <p className="text-sm">Difficulty: {problem.difficulty}</p>
                <Link 
                  href={`/simulator/pda?problem=${problem.id}`}
                  className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Solve
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 