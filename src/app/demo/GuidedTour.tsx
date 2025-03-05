'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../../app/context/ThemeContext';

// Define the structure for a tour step
interface TourStep {
  title: string;
  content: string;
  target: string; // CSS selector for the target element
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
  isActive: boolean;
  onComplete: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  isActive,
  onComplete
}) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Define all steps in the guided tour - simplified version
  const tourSteps = useMemo<TourStep[]>(() => [
    {
      title: "Welcome to the DFA Simulator",
      content: "This interactive simulator helps you create and test Deterministic Finite Automata (DFAs). DFAs are mathematical models used to recognize patterns and solve problems in computation theory, compilers, and text processing.",
      target: "body",
      position: "top"
    },
    {
      title: "What is a DFA?",
      content: "A DFA has 5 components: a set of states, an alphabet of input symbols, transition functions, an initial state, and a set of final/accepting states. The key property of a DFA is DETERMINISM - each state can have exactly one transition for any input symbol.",
      target: "body",
      position: "top"
    },
    {
      title: "Adding Your First State",
      content: "Click the 'Add Node' button to create your first state. This will automatically be the initial state (q0) where all input processing begins. You'll see an arrow pointing to it indicating it's the start state.",
      target: "button:contains('Add Node')",
      position: "right"
    },
    {
      title: "Initial State",
      content: "This is your initial state (q0). All input strings begin processing at this state. You can drag states to reposition them on the canvas.",
      target: "g:contains('q0')",
      position: "bottom"
    },
    {
      title: "Adding Another State",
      content: "Click 'Add Node' again to create a second state (q1). To create a complete DFA, you'll need at least one accepting state.",
      target: "button:contains('Add Node')",
      position: "right"
    },
    {
      title: "Setting an Accepting State",
      content: "To make a state accepting (final), first click on the state to select it, then click 'Toggle Final State'. Accepting states are represented by double circles and indicate where strings can be accepted.",
      target: "g:contains('q1')",
      position: "bottom"
    },
    {
      title: "Understanding Accepting States",
      content: "An input string is accepted by the DFA if, after processing all symbols, the DFA ends in an accepting state. Otherwise, the string is rejected. A DFA must have at least one accepting state.",
      target: "button:contains('Toggle Final State')",
      position: "right"
    },
    {
      title: "Creating a Transition - Step 1",
      content: "First, make sure no states are currently selected (click on empty space if needed). Then click on the source state (q0) to select it.",
      target: "g:contains('q0')",
      position: "bottom"
    },
    {
      title: "Creating a Transition - Step 2",
      content: "With q0 selected (highlighted), now click on the destination state (q1). This will open a dialog to enter the input symbol(s) that trigger this transition.",
      target: "g:contains('q1')",
      position: "bottom"
    },
    {
      title: "Creating a Transition - Step 3",
      content: "Enter an input symbol (like 'a' or '0') in the popup dialog and click Submit. You can enter multiple symbols separated by commas (e.g., 'a,b,c'). Remember, in a DFA, each state can have at most ONE transition for each input symbol.",
      target: ".popup-transition-input",
      position: "bottom"
    },
    {
      title: "DFA Determinism",
      content: "IMPORTANT: In a DFA, each state must have exactly one transition for each input symbol. If you try to add multiple transitions with the same symbol from one state, you'll get a validation error - this would make it non-deterministic.",
      target: "body",
      position: "top"
    },
    {
      title: "Self-Loops",
      content: "You can create a transition from a state back to itself (self-loop). Select a state and then click it again to create a self-loop. These are useful for inputs that don't change the state.",
      target: "g:contains('q0')",
      position: "bottom"
    },
    {
      title: "Complete DFA - Edge Case",
      content: "For a complete DFA, ensure every state has a transition for every possible input symbol. Incomplete DFAs will reject strings if they encounter a missing transition.",
      target: "body",
      position: "top"
    },
    {
      title: "Testing Your DFA",
      content: "Enter a test string in the input field and click 'Run' to simulate how your DFA processes it. The simulation will highlight each transition as it's taken.",
      target: "button:contains('Run')",
      position: "right"
    },
    {
      title: "Step-by-Step Testing",
      content: "You can also use 'Step' to process the input one symbol at a time. This is useful for debugging and understanding how the DFA processes input.",
      target: "button:contains('Step')",
      position: "right"
    },
    {
      title: "Edge Case: Empty String",
      content: "To accept the empty string (ε), make your initial state an accepting state. The empty string is accepted if the DFA's initial state is an accepting state.",
      target: "g:contains('q0')",
      position: "bottom"
    },
    {
      title: "Edge Case: Dead States",
      content: "Consider adding a 'trap' or 'dead' state for handling invalid inputs. This is a non-accepting state that transitions to itself for all inputs.",
      target: "button:contains('Add Node')",
      position: "right"
    },
    {
      title: "Sharing Your DFA",
      content: "You can share your DFA design with others using the 'Share DFA' button. This generates a URL that captures your current DFA design.",
      target: "button:contains('Share')",
      position: "right"
    },
    {
      title: "Congratulations!",
      content: "You now know the basics of creating and testing DFAs! Try building automata for real problems like validating binary numbers divisible by 3, recognizing string patterns, or modeling simple protocols.",
      target: "body",
      position: "top"
    }
  ], []);

  useEffect(() => {
    if (!isActive) return;
    
    // Position the tooltip relative to the target element
    const positionTooltip = () => {
      const step = tourSteps[currentStep];
      let targetElement: Element | null = null;
      
      // Find the target element using the selector
      if (step.target === "body") {
        targetElement = document.body;
      } else if (step.target.includes(":contains(")) {
        // Custom selector for elements containing text
        const text = step.target.match(/:contains\('(.+)'\)/)?.[1] || "";
        const elements = document.querySelectorAll(step.target.split(":contains")[0]);
        
        for (const elem of elements) {
          if (elem.textContent?.includes(text)) {
            targetElement = elem;
            break;
          }
        }
      } else {
        targetElement = document.querySelector(step.target);
      }
      
      if (!targetElement || !tooltipRef.current) return;
      
      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      // Position the tooltip based on the specified position
      switch (step.position) {
        case 'top':
          top = targetRect.top - tooltipRect.height - 10;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + 10;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.left - tooltipRect.width - 10;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.right + 10;
          break;
      }
      
      // Make sure the tooltip stays within viewport
      if (left < 0) left = 10;
      if (top < 0) top = 10;
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      if (top + tooltipRect.height > window.innerHeight) {
        top = window.innerHeight - tooltipRect.height - 10;
      }
      
      setTooltipPosition({ top, left });
    };
    
    // Position the tooltip and set up a window resize listener
    positionTooltip();
    window.addEventListener('resize', positionTooltip);
    
    return () => {
      window.removeEventListener('resize', positionTooltip);
    };
  }, [currentStep, isActive, tourSteps]);

  // Handle next step
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(); // Tour is complete
    }
  };

  // Handle previous step
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle skip tour
  const handleSkip = () => {
    onComplete();
  };

  if (!isActive) return null;

  return (
    <>
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: 'translate(0, 0)'
        }}
      >
        <h3 className="text-lg font-semibold mb-2">{tourSteps[currentStep].title}</h3>
        <p className="mb-4">{tourSteps[currentStep].content}</p>
        
        <div className="flex justify-between">
          <div>
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-3 py-1 rounded ${
                currentStep === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSkip}
              className={`px-3 py-1 rounded ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Skip
            </button>
            
            <button
              onClick={handleNext}
              className={`px-3 py-1 rounded ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
        
        {/* Step indicator */}
        <div className="mt-4 flex justify-center space-x-1">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentStep
                  ? theme === 'dark'
                    ? 'bg-blue-500'
                    : 'bg-blue-600'
                  : theme === 'dark'
                  ? 'bg-gray-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GuidedTour;