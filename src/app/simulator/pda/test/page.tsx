'use client';

import Link from 'next/link';
import { useTheme } from '../../../../app/context/ThemeContext';



export default function PDATestPage() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <h1 className="text-3xl font-bold mb-8">PDA Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Link 
          href="/simulator/pda/test/example1" 
          className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
            ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
        >
          <h2 className="text-xl font-semibold mb-2">PDA: a^n b^n</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            A PDA that accepts strings with an equal number of a&apos;s and b&apos;s.
          </p>
          <div className="mt-4 flex justify-end">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${theme === 'dark' ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'}`}>
              Try Example &rarr;
            </span>
          </div>
        </Link>

        <Link 
          href="/simulator/pda/test/example2" 
          className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
            ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
        >
          <h2 className="text-xl font-semibold mb-2">PDA: Balanced Parentheses</h2> 
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            A PDA that accepts strings with balanced parentheses.
          </p>
          <div className="mt-4 flex justify-end">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${theme === 'dark' ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'}`}>
              Try Example &rarr;
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}