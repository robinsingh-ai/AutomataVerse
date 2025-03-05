'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type NavbarProps = {
  onThemeChange: (theme: 'light' | 'dark') => void;
  currentTheme: 'light' | 'dark';
};

const Navbar: React.FC<NavbarProps> = ({ onThemeChange, currentTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const themeColor = '#70D9C2';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-auto relative">
                <Image 
                  src="/logo/png/3.png" 
                  alt="AutomataVerse" 
                  width={80} 
                  height={20}
                  className={`${currentTheme === 'dark' ? 'brightness-200' : ''} object-contain`}
                  priority
                />
              </div>
              <span className="text-xl font-medium mr-2">
                <span style={{ color: '#70DAC2' }}>Automata</span>
                <span className={`font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Verse</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link href="/simulator" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-500">
              Simulators
            </Link>
            <Link href="/getting-started" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-500">
              Getting Started
            </Link>
            <Link href="/features" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-500">
              Features
            </Link>
            <Link href="/signup" className="ml-2 px-4 py-2 rounded-md text-sm font-medium border border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors text-teal-500">
              Sign Up
            </Link>
            <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-opacity-90 transition-colors" style={{ backgroundColor: themeColor }}>
              Login
            </Link>
            <button 
              onClick={() => onThemeChange(currentTheme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center justify-center p-2 rounded-full ${
                currentTheme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'
              } hover:text-white transition-colors hover:bg-teal-500`}
              aria-label="Toggle dark mode"
            >
              {currentTheme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                currentTheme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${menuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <Link 
            href="/simulator" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              currentTheme === 'dark' ? 'text-white hover:text-teal-400' : 'text-gray-900 hover:text-teal-600'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Simulators
          </Link>
          <Link 
            href="/getting-started" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              currentTheme === 'dark' ? 'text-white hover:text-teal-400' : 'text-gray-900 hover:text-teal-600'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Getting Started
          </Link>
          <Link 
            href="/features" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              currentTheme === 'dark' ? 'text-white hover:text-teal-400' : 'text-gray-900 hover:text-teal-600'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="/signup" 
            className={`block px-3 py-2 rounded-md text-base font-medium border border-teal-500 text-teal-500 my-2`}
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
          <Link 
            href="/login" 
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-opacity-90 my-2"
            style={{ backgroundColor: themeColor }}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <button 
            onClick={() => {
              onThemeChange(currentTheme === 'dark' ? 'light' : 'dark');
              setMenuOpen(false);
            }}
            className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium ${
              currentTheme === 'dark' ? 'text-white hover:text-teal-400' : 'text-gray-900 hover:text-teal-600'
            }`}
          >
            <span className="mr-2">
              {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
            {currentTheme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 