'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Link from 'next/link';

// Define a common problem interface that includes type
interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: 'dfa' | 'nfa' | 'pda' | 'tm';
}

export default function LearnPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [currentTab, setCurrentTab] = useState<'dfa' | 'nfa' | 'pda' | 'tm'>('dfa');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [problemCounts, setProblemCounts] = useState({ dfa: 0, nfa: 0, pda: 0, tm: 0 });

  // Fetch problems from API on page load
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/problems');
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();
        
        // Make sure we have valid problem data
        if (data.problems && Array.isArray(data.problems)) {
          setProblems(data.problems);
          
          // Set problem counts from the API response
          setProblemCounts({
            dfa: data.types?.dfa || 0,
            nfa: data.types?.nfa || 0,
            pda: data.types?.pda || 0,
            tm: data.types?.tm || 0
          });
        } else {
          console.error('Invalid problems data structure:', data);
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Function to encode problem ID for URL
  const encodeProblemForURL = (problem: Problem): string => {
    return `problem=${problem.id}`;
  };

  // Filter problems based on search query, difficulty and current tab
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesSearch = searchQuery === '' || 
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
      
      const matchesTab = problem.type === currentTab;
      
      return matchesSearch && matchesDifficulty && matchesTab;
    });
  }, [problems, searchQuery, difficultyFilter, currentTab]);

  // Get counts for each difficulty level for the current tab
  const difficultyCounts = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    problems
      .filter(problem => problem.type === currentTab)
      .forEach(problem => {
        counts[problem.difficulty]++;
      });
    return counts;
  }, [problems, currentTab]);

  // Function to render difficulty badge
  const renderDifficultyBadge = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    const colors = {
      Easy: isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
      Medium: isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
      Hard: isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`text-sm px-2 py-1 rounded-full ${colors[difficulty]}`}>
        {difficulty}
      </span>
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span style={{ color: '#70D9C2' }}>Practice</span> Automata
              </h1>
              <p className="text-lg mb-4 md:mb-0">
                Solve problems to master the concepts of automata theory
              </p>
            </div>
            
            {/* Search and filter */}
            <div className="w-full md:w-auto">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`px-4 py-2 rounded-lg ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-teal-500`}
                />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as 'All' | 'Easy' | 'Medium' | 'Hard')}
                  className={`px-4 py-2 rounded-lg ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Tabs for different automata types */}
          <div className="flex mb-6 border-b overflow-x-auto scrollbar-hide whitespace-nowrap md:whitespace-normal">
            <button 
              onClick={() => setCurrentTab('dfa')}
              className={`px-4 py-2 text-sm font-medium ${
                currentTab === 'dfa' 
                  ? `border-b-2 ${isDark ? 'border-teal-400 text-teal-400' : 'border-teal-500 text-teal-600'}` 
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              DFA Problems <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-teal-500 text-white">{problemCounts.dfa}</span>
            </button>
            <button 
              onClick={() => setCurrentTab('nfa')}
              className={`px-4 py-2 text-sm font-medium ${
                currentTab === 'nfa' 
                  ? `border-b-2 ${isDark ? 'border-purple-400 text-purple-400' : 'border-purple-500 text-purple-600'}` 
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              NFA Problems <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-purple-500 text-white">{problemCounts.nfa}</span>
            </button>
            <button 
              onClick={() => setCurrentTab('pda')}
              className={`px-4 py-2 text-sm font-medium ${
                currentTab === 'pda' 
                  ? `border-b-2 ${isDark ? 'border-blue-400 text-blue-400' : 'border-blue-500 text-blue-600'}` 
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              PDA Problems <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-500 text-white">{problemCounts.pda}</span>
            </button>
            <button 
              onClick={() => setCurrentTab('tm')}
              className={`px-4 py-2 text-sm font-medium ${
                currentTab === 'tm' 
                  ? `border-b-2 ${isDark ? 'border-red-400 text-red-400' : 'border-red-500 text-red-600'}` 
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              TM Problems <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-500 text-white">{problemCounts.tm}</span>
            </button>
          </div>
          
          {/* Difficulty stats */}
          <div className="mb-6 flex flex-wrap gap-2">
            <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm flex items-center`}>
              <div className={`w-3 h-3 rounded-full bg-green-500 mr-2`}></div>
              <span>Easy: {difficultyCounts.Easy}</span>
            </div>
            <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm flex items-center`}>
              <div className={`w-3 h-3 rounded-full bg-yellow-500 mr-2`}></div>
              <span>Medium: {difficultyCounts.Medium}</span>
            </div>
            <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm flex items-center`}>
              <div className={`w-3 h-3 rounded-full bg-red-500 mr-2`}></div>
              <span>Hard: {difficultyCounts.Hard}</span>
            </div>
            <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm flex items-center`}>
              <div className={`w-3 h-3 rounded-full bg-gray-500 mr-2`}></div>
              <span>Total: {problems.filter(p => p.type === currentTab).length}</span>
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          )}
          
          {/* Problems grid */}
          {!isLoading && (currentTab === 'dfa' || currentTab === 'nfa' || currentTab === 'pda') && (
            <>
              {filteredProblems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProblems.map((problem) => (
                    <div 
                      key={problem.id} 
                      className={`rounded-lg shadow-lg border transition-all transform hover:-translate-y-1 hover:shadow-xl ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-xl font-bold">{problem.title}</div>
                          {renderDifficultyBadge(problem.difficulty)}
                        </div>
                        <p className="mb-6 text-gray-500 dark:text-gray-400 line-clamp-3">{problem.description}</p>
                        
                        <div className="flex justify-end">
                          <Link 
                            href={`/simulator/${problem.type}?${encodeProblemForURL(problem)}`}
                            className={`px-5 py-2 font-medium rounded-md transition-colors ${
                              isDark 
                                ? `${problem.type === 'dfa' 
                                    ? 'bg-teal-600' 
                                    : problem.type === 'nfa' 
                                      ? 'bg-purple-600' 
                                      : problem.type === 'tm'
                                        ? 'bg-red-600'
                                        : 'bg-blue-600'} text-white hover:${
                                        problem.type === 'dfa' 
                                          ? 'bg-teal-700' 
                                          : problem.type === 'nfa' 
                                            ? 'bg-purple-700'
                                            : problem.type === 'tm'
                                              ? 'bg-red-700' 
                                              : 'bg-blue-700'}` 
                                : `${problem.type === 'dfa' 
                                    ? 'bg-teal-500' 
                                    : problem.type === 'nfa' 
                                      ? 'bg-purple-500'
                                      : problem.type === 'tm'
                                        ? 'bg-red-500' 
                                        : 'bg-blue-500'} text-white hover:${
                                        problem.type === 'dfa' 
                                          ? 'bg-teal-600' 
                                          : problem.type === 'nfa' 
                                            ? 'bg-purple-600'
                                            : problem.type === 'tm'
                                              ? 'bg-red-600' 
                                              : 'bg-blue-600'}`
                            }`}
                          >
                            Solve Problem
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  No problems found
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}