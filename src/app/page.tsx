'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import AutomataBanner from './components/AutomataBanner';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const themeColor = '#70D9C2';
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className={`overflow-auto ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Fixed Header */}
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />
      
      {/* Floating Feedback Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSdmNyVJTWUU7G5W7Zxu6jX9NPHWoz4g82x67UEvc-y-0SaXkw/viewform?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-white transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: themeColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Feedback
        </a>
      </div>
      
      {/* Hero Section */}
      <div className="pt-16">
        {/* Announcement Banner */}
        {showBanner && (
          <div className="bg-red-500 text-white p-3 relative mb-6 mx-4 sm:mx-6 lg:mx-8 rounded">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <span className="font-medium">
                Added new problem sets for DFA in learning section
              </span>
              
              <button 
                onClick={() => setShowBanner(false)}
                className="absolute right-4 top-3 text-white hover:text-gray-200"
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
            <div className={`mb-8 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              isDark ? 'bg-opacity-20 bg-teal-600 text-teal-200' : 'bg-teal-100 text-teal-800'
            }`} style={{ backgroundColor: isDark ? 'rgba(112, 217, 194, 0.2)' : 'rgba(112, 217, 194, 0.2)' }}>
              Interactive Automata Simulation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Dive into the world of <span style={{ color: themeColor }}>Automata Theory</span> for free!
            </h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              From simple finite automata to complex Turing machines, plot state diagrams, 
              test input strings, and explore the foundations of theoretical computer science.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/simulator" 
                className="px-8 py-3 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                style={{ backgroundColor: themeColor }}>
                Launch Simulator
              </Link>
              <Link href="/getting-started" 
                className={`px-8 py-3 rounded-lg font-medium border transition-colors ${
                  isDark ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'
                }`}>
                Learn More
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            {/* Using the AutomataBanner component */}
            <AutomataBanner isDark={isDark} customThemeColor={themeColor} />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful <span style={{ color: themeColor }}>Features</span> for Automata Enthusiasts
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Explore the rich functionality of our automata simulation platform designed to enhance your learning and research
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cloud Save Feature */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg transition-transform duration-300 hover:transform hover:scale-105`}>
              <div className="h-14 w-14 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: `${themeColor}30` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={themeColor}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cloud Save</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Save your automata designs securely to the cloud and access them from anywhere. Never lose your work again!
              </p>
            </div>
            
            {/* Share Machines Feature */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg transition-transform duration-300 hover:transform hover:scale-105`}>
              <div className="h-14 w-14 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: `${themeColor}30` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={themeColor}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Machines</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Generate shareable links to your automata designs for easy collaboration with colleagues and professors.
              </p>
            </div>
            
            {/* JSON Import/Export Feature */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg transition-transform duration-300 hover:transform hover:scale-105`}>
              <div className="h-14 w-14 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: `${themeColor}30` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={themeColor}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">JSON Import/Export</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Load and save machines using JSON format, enabling easy backup and migration between different platforms.
              </p>
            </div>
            
            {/* Multiple Automata Types */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg transition-transform duration-300 hover:transform hover:scale-105`}>
              <div className="h-14 w-14 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: `${themeColor}30` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={themeColor}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Automata Types</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Design and simulate DFA, NFA, PDA, FSM, and Turing machines all in one platform with specialized interfaces.
              </p>
            </div>
            
            {/* Interactive Testing */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg transition-transform duration-300 hover:transform hover:scale-105`}>
              <div className="h-14 w-14 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: `${themeColor}30` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={themeColor}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Testing</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Test your machines with custom input strings and watch the state transitions in real-time with step-by-step visualization.
              </p>
            </div>
            
            {/* User Profiles */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg transition-transform duration-300 hover:transform hover:scale-105`}>
              <div className="h-14 w-14 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: `${themeColor}30` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={themeColor}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">User Profiles</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Create your personal profile to manage all your saved machines in one convenient dashboard.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/simulator" 
              className="px-8 py-3 text-white rounded-lg font-medium hover:bg-opacity-90 inline-flex items-center gap-2 transition-colors"
              style={{ backgroundColor: themeColor }}>
              Try All Features
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Start building and simulating automata with our interactive tools
          </p>
          <Link href="/simulator" 
            className="inline-block px-8 py-4 rounded-lg font-medium text-white transform transition-transform hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: themeColor }}>
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
            <div> <a href="https://www.producthunt.com/posts/automataverse?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-automataverse" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=938252&theme=light&t=1741194877338" alt="AutomataVerse - Automata&#0032;simulator&#0032;for&#0032;dfa&#0044;&#0032;nfa&#0044;&#0032;pda&#0032;&#0038;&#0032;turing&#0032;machines | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" /></a></div>
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