'use client';

import Navbar from '../../components/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <h1 className="text-3xl font-bold text-white">About AutomataVerse</h1>
              <p className="mt-2 text-blue-100">A comprehensive platform for learning and exploring automata theory</p>
            </div>
            
            <div className="p-6 sm:p-10">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <h2>What is AutomataVerse?</h2>
                <p>
                  AutomataVerse is an interactive educational platform designed to help students, educators, and enthusiasts 
                  understand and visualize automata theory concepts. Our primary focus is on providing intuitive, visual tools 
                  for working with different types of automata, including Deterministic Finite Automata (DFA), 
                  Non-deterministic Finite Automata (NFA), and Pushdown Automata.
                </p>
                
                <h2>Features</h2>
                <ul>
                  <li>
                    <strong>Interactive DFA Simulator</strong> - Create, edit, and test DFAs with an intuitive visual interface.
                    Add states, create transitions, and validate input strings in real-time.
                  </li>
                  <li>
                    <strong>Step-by-Step Execution</strong> - Watch how automata process input strings one character at a time,
                    with clear visualization of state transitions.
                  </li>
                  <li>
                    <strong>Modern User Interface</strong> - Enjoy a clean, responsive design that works across desktop and mobile devices.
                  </li>
                  <li>
                    <strong>Educational Resources</strong> - Access examples and tutorials to deepen your understanding of automata theory.
                  </li>
                </ul>
                
                <h2>Why Automata Theory?</h2>
                <p>
                  Automata theory is a foundational area of computer science that helps us understand the theoretical 
                  limits of computation. It provides essential knowledge for language processing, compiler design, 
                  natural language processing, and many other applications. By making automata theory more accessible 
                  and intuitive, AutomataVerse aims to help more people build this crucial computational knowledge.
                </p>
                
                <h2>How to Use</h2>
                <p>
                  Navigate to the DFA Simulator to begin creating automata. Add states by clicking the "Add Node" button, 
                  create transitions between states by clicking on states, and test input strings by entering them in the 
                  control panel. Use the "Run" button to see the entire validation process, or "Step" to walk through it 
                  one character at a time.
                </p>
                
                <h2>The Team</h2>
                <p>
                  AutomataVerse was created by a team of computer science students and educators passionate about making 
                  theoretical computer science more approachable and engaging.
                </p>
                
                <h2>Contact</h2>
                <p>
                  Have questions, suggestions, or feedback? We'd love to hear from you! Reach out to us at 
                  <a href="mailto:contact@automataverse.com" className="text-blue-600 dark:text-blue-400 ml-1">
                    contact@automataverse.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 