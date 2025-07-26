'use client';

import Link from 'next/link';
import { useState } from 'react';
import AutomataBanner from './components/AutomataBanner';
import Navbar from './components/Navbar';
import { useResponsive } from './context/ResponsiveContext';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { isMobile, isSmallMobile } = useResponsive();
  const isDark = theme === 'dark';
  const themeColor = '#70D9C2';
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className={`overflow-auto ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Fixed Header */}
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />

      {/* Floating Feedback Button - Hidden on small mobile */}
      {!isSmallMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdmNyVJTWUU7G5W7Zxu6jX9NPHWoz4g82x67UEvc-y-0SaXkw/viewform?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-white transition-all duration-300 hover:scale-105 touch-target"
            style={{ backgroundColor: themeColor }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className={isMobile ? 'text-sm' : 'text-base'}>Feedback</span>
          </a>
        </div>
      )}

      {/* Hero Section */}
      <div className="pt-16">
        {/* Announcement Banner */}
        {showBanner && (
          <div className="bg-red-500 text-white p-3 relative mb-6 mx-4 sm:mx-6 lg:mx-8 rounded">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                Added new problem sets for DFA in learning section
              </span>

              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-4 top-3 text-white hover:text-gray-200 touch-target"
                aria-label="Close banner"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-wrap lg:flex-nowrap items-center">
          <div className="w-full lg:w-1/2 lg:pr-8">
            <div className={`mb-8 inline-block px-3 py-1 rounded-full text-sm font-semibold ${isDark ? 'bg-opacity-20 bg-teal-600 text-teal-200' : 'bg-teal-100 text-teal-800'
              }`} style={{ backgroundColor: isDark ? 'rgba(112, 217, 194, 0.2)' : 'rgba(112, 217, 194, 0.2)' }}>
              Interactive Automata Simulation
            </div>
            <h1 className={`${isMobile ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'} font-bold mb-6`}>
              Dive into the world of <span style={{ color: themeColor }}>Automata Theory</span> for free!
            </h1>
            <p className={`${isMobile ? 'text-base' : 'text-lg'} mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              From simple finite automata to complex Turing machines, plot state diagrams,
              test input strings, and explore the foundations of theoretical computer science.
            </p>
            <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-wrap gap-4'}`}>
              <Link href="/simulator"
                className={`${isMobile ? 'w-full text-center' : ''} px-8 py-3 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors touch-target`}
                style={{ backgroundColor: themeColor }}>
                Launch Simulator
              </Link>
              <Link href="/getting-started"
                className={`${isMobile ? 'w-full text-center' : ''} px-8 py-3 rounded-lg font-medium border transition-colors touch-target ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'
                  }`}>
                Learn More
              </Link>
            </div>
          </div>
          <div className={`w-full lg:w-1/2 ${isMobile ? 'mt-8' : 'mt-12 lg:mt-0'}`}>
            {/* Using the AutomataBanner component */}
            <AutomataBanner isDark={isDark} customThemeColor={themeColor} />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`${isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-bold mb-4`}>
              Powerful <span style={{ color: themeColor }}>Features</span> for Automata Enthusiasts
            </h2>
            <p className={`${isMobile ? 'text-base' : 'text-lg'} ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Explore a comprehensive suite of tools designed to make learning automata theory engaging and interactive.
            </p>
          </div>

          <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
            {/* Feature 1 */}
            <div className={`p-6 rounded-xl transition-all duration-300 card-hover ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
              } shadow-lg`}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: themeColor }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Interactive Simulators
              </h3>
              <p className={`${isMobile ? 'text-sm' : 'text-base'} ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Visualize and interact with DFA, NFA, PDA, and Turing Machines in real-time with our intuitive simulators.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 rounded-xl transition-all duration-300 card-hover ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
              } shadow-lg`}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: themeColor }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Comprehensive Learning
              </h3>
              <p className={`${isMobile ? 'text-sm' : 'text-base'} ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Access detailed tutorials, examples, and problem sets to master automata theory concepts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 rounded-xl transition-all duration-300 card-hover ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
              } shadow-lg`}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: themeColor }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Mobile Optimized
              </h3>
              <p className={`${isMobile ? 'text-sm' : 'text-base'} ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Fully responsive design with touch-friendly controls, perfect for learning on any device.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className={`${isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-bold mb-4`}>
            Ready to Start Learning?
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-lg'} mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of students and professionals exploring automata theory with our interactive platform.
          </p>
          <Link
            href="/simulator"
            className={`inline-block px-8 py-3 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors touch-target ${isMobile ? 'w-full sm:w-auto' : ''}`}
            style={{ backgroundColor: themeColor }}
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-12 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-medium">
                  <span style={{ color: '#70DAC2' }}>Automata</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Verse</span>
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">
                Copyright © 2025 AutomataVerse, All rights reserved.
              </p>
              <p className="mt-1 text-sm font-medium">
                Developed by <a
                  href="https://robinsingh.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-teal-500 transition-colors"
                  style={{ color: themeColor }}
                >
                  Robin
                </a>
              </p>

            </div>
            <div> <a href="https://www.producthunt.com/posts/automataverse?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-automataverse" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=938252&theme=light&t=1741194877338" alt="AutomataVerse - Automata&#0032;simulator&#0032;for&#0032;dfa&#0044;&#0032;nfa&#0044;&#0032;pda&#0032;&#0038;&#0032;turing&#0032;machines | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" /></a></div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="font-semibold mb-3">Simulators</h3>
                <ul className="space-y-2">
                  <li><Link href="/simulator/dfa" className="hover:text-teal-500 transition-colors">DFA</Link></li>
                  <li><Link href="/simulator/nfa" className="hover:text-teal-500 transition-colors">NFA</Link></li>
                  <li><Link href="/simulator/pda" className="hover:text-teal-500 transition-colors">PDA</Link></li>
                  <li><Link href="/simulator/tm" className="hover:text-teal-500 transition-colors">Turing Machine</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/getting-started" className="hover:text-teal-500 transition-colors">Getting Started</Link></li>
                  <li><Link href="/features" className="hover:text-teal-500 transition-colors">Features</Link></li>
                  <li><Link href="/blog" className="hover:text-teal-500 transition-colors">Blog</Link></li>
                  <li><Link href="/about" className="hover:text-teal-500 transition-colors">About</Link></li>
                  <li>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSdmNyVJTWUU7G5W7Zxu6jX9NPHWoz4g82x67UEvc-y-0SaXkw/viewform?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-teal-500 transition-colors"
                    >
                      Feedback
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}