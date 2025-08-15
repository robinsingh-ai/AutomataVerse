'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch contributors from GitHub API
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.github.com/repos/robinsingh-ai/AutomataVerse/contributors');
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data: Contributor[] = await response.json();
        setContributors(data);
      } catch (err) {
        console.error('Failed to fetch contributors:', err);
        setError('Failed to load contributors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              About <span style={{ color: '#70D9C2' }}>AutomataVerse</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
              AutomataVerse is an interactive educational platform where users can simulate various types of automata. 
              Our simulator allows students and educators to create, test, and visualize automata behavior in real-time, 
              making theoretical computer science concepts more accessible and understandable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/simulator"
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Try Simulators
              </Link>
              <Link 
                href="/learn"
                className={`border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors`}
              >
                Start Learning
              </Link>
            </div>
          </div>


          {/* Contributors Section */}
          <div className="mb-16">
            <div className={`p-8 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Our Contributors</h2>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  AutomataVerse is made possible by our amazing open-source contributors from around the world.
                </p>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    {error}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : contributors.length > 0 ? (
                <>
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {contributors.map((contributor) => (
                      <a
                        key={contributor.id}
                        href={contributor.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                        title={`${contributor.login} - ${contributor.contributions} contributions`}
                      >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 hover:border-teal-500 transition-colors group-hover:scale-110 transform duration-200">
                          <Image
                            src={contributor.avatar_url}
                            alt={contributor.login}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {contributor.login}
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Contributors: {contributors.length} • Hover over avatars to see usernames
                    </p>
                    <Link 
                      href="https://github.com/robinsingh-ai/AutomataVerse"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      Contribute on GitHub
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No contributors found. This might be a private repository or an API issue.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Simulating?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience the power of interactive automata simulation. Design, test, and understand 
              automata like never before.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/simulator"
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Start Simulating
              </Link>
              <Link 
                href="/demo"
                className={`border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors`}
              >
                Watch Demo
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
