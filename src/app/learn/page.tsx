'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { DFAProblem } from '../../simulators/dfa/problemsets/problems';

export default function LearnPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [currentTab, setCurrentTab] = useState<'dfa' | 'nfa' | 'pda' | 'tm'>('dfa');
  const [problems, setProblems] = useState<Record<string, Omit<DFAProblem, 'accept' | 'reject'>>>({});
  const [isLoading, setIsLoading] = useState(true);

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
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Function to encode problem ID for URL
  const encodeProblemForURL = (problemId: string): string => {
    const params = new URLSearchParams();
    params.append('problemId', problemId);
    return params.toString();
  };

  // Filter problems based on search query and difficulty
  const filteredProblems = useMemo(() => {
    return Object.values(problems).filter(problem => {
      const matchesSearch = searchQuery === '' || 
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
      
      return matchesSearch && matchesDifficulty;
    });
  }, [problems, searchQuery, difficultyFilter]);

  // Get counts for each difficulty level
  const difficultyCounts = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    Object.values(problems).forEach(problem => {
      counts[problem.difficulty]++;
    });
    return counts;
  }, [problems]);

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
              DFA Problems <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-teal-500 text-white">{Object.keys(problems).length}</span>
            </button>
            <button 
              onClick={() => setCurrentTab('nfa')}
              className={`px-4 py-2 text-sm font-medium ${
                currentTab === 'nfa' 
                  ? `border-b-2 ${isDark ? 'border-purple-400 text-purple-400' : 'border-purple-500 text-purple-600'}` 
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              NFA Problems <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-500 text-white">Coming Soon</span>
            </button>
            <button 
              onClick={() => setCurrentTab('pda')}
              className={`px-4 py-2 text-sm font-medium ${
                currentTab === 'pda' 
                  ? `border-b-2 ${isDark ? 'border-blue-400 text-blue-400' : 'border-blue-500 text-blue-600'}` 
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              PDA Problems <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-500 text-white">Coming Soon</span>
            </button>
            <button 
              onClick={() => setCurrentTab('tm')}
              className={`px-4 py-2 text-sm font-medium ${
                currentTab === 'tm' 
                  ? `border-b-2 ${isDark ? 'border-red-400 text-red-400' : 'border-red-500 text-red-600'}` 
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              TM Problems <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-500 text-white">Coming Soon</span>
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
              <span>Total: {Object.keys(problems).length}</span>
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          )}
          
          {/* Problems grid */}
          {!isLoading && currentTab === 'dfa' && (
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
                            href={`/simulator/dfa?${encodeProblemForURL(problem.id)}`}
                            className={`px-5 py-2 font-medium rounded-md transition-colors ${
                              isDark 
                                ? 'bg-teal-600 text-white hover:bg-teal-700' 
                                : 'bg-teal-500 text-white hover:bg-teal-600'
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
                <div className={`rounded-lg p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <h3 className="text-xl font-semibold mb-2">No matching problems found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
          
          {!isLoading && currentTab !== 'dfa' && (
            <div className={`rounded-lg p-12 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h3 className="text-2xl font-semibold mb-2">Coming Soon!</h3>
              <p className="text-lg mb-6">{currentTab.toUpperCase()} practice problems are under development</p>
              <p className="text-gray-500 dark:text-gray-400">
                We&apos;re working hard to create high-quality practice problems for {
                  currentTab === 'nfa' ? 'Non-deterministic Finite Automata' :
                  currentTab === 'pda' ? 'Pushdown Automata' :
                  'Turing Machines'
                }. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 