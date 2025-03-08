'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Complex NFA that demonstrates advanced non-deterministic behavior
// This NFA accepts strings that:
// 1. Contain an even number of 'a's OR
// 2. End with the pattern "abb" OR
// 3. Start with "ba"
const complexNFA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "transitions": [
        {
          "targetid": "q1",
          "label": "a"  // Path for even number of 'a's
        },
        {
          "targetid": "q3",
          "label": "ε"  // Epsilon path to start checking for "abb" pattern
        },
        {
          "targetid": "q6",
          "label": "b"  // Start checking for "ba" pattern
        }
      ]
    },
    {
      // State for tracking even/odd 'a's - even when in q0 or q2
      "id": "q1",
      "x": 250,
      "y": 100,
      "transitions": [
        {
          "targetid": "q1",
          "label": "b"  // 'b' doesn't change even/odd status
        },
        {
          "targetid": "q2",
          "label": "a"  // Another 'a' flips to odd
        }
      ]
    },
    {
      // State for tracking even/odd 'a's - odd when in q1
      "id": "q2", 
      "x": 250,
      "y": 200,
      "transitions": [
        {
          "targetid": "q2",
          "label": "b"  // 'b' doesn't change even/odd status
        },
        {
          "targetid": "q1",
          "label": "a"  // Another 'a' flips back to even
        }
      ]
    },
    {
      // Start state for "abb" pattern
      "id": "q3",
      "x": 400,
      "y": 150,
      "transitions": [
        {
          "targetid": "q3",
          "label": "a"  // Can skip any number of 'a's
        },
        {
          "targetid": "q3",
          "label": "b"  // Can skip any number of 'b's
        },
        {
          "targetid": "q4",
          "label": "a"  // Start matching "abb" pattern
        }
      ]
    },
    {
      // After seeing 'a' in "abb" pattern
      "id": "q4",
      "x": 550,
      "y": 150,
      "transitions": [
        {
          "targetid": "q5",
          "label": "b"  // Continue matching, saw "ab"
        }
      ]
    },
    {
      // After seeing "ab" in "abb" pattern
      "id": "q5",
      "x": 700,
      "y": 150,
      "transitions": [
        {
          "targetid": "q8",
          "label": "b"  // Complete pattern, saw "abb"
        }
      ]
    },
    {
      // Start state for "ba" pattern
      "id": "q6",
      "x": 400,
      "y": 250,
      "transitions": [
        {
          "targetid": "q7",
          "label": "a"  // Complete "ba" pattern
        }
      ]
    },
    {
      // After seeing "ba" pattern
      "id": "q7",
      "x": 550,
      "y": 250,
      "transitions": [
        {
          "targetid": "q7",
          "label": "a"  // Can read any number of 'a's after
        },
        {
          "targetid": "q7",
          "label": "b"  // Can read any number of 'b's after
        }
      ]
    },
    {
      // Accepting state for "abb" pattern
      "id": "q8",
      "x": 850,
      "y": 150,
      "transitions": []
    }
  ],
  "finalStates": ["q1", "q8", "q7"],  // Accept strings with even 'a's (q1), ending with "abb" (q8), or starting with "ba" (q7)
  "allowEpsilon": true  // Explicitly allow epsilon transitions
};

export default function ComplexNFAPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the NFA simulator with the complex NFA
    const encodedNFA = encodeURIComponent(JSON.stringify(complexNFA));
    router.push(`/simulator/nfa?nfa=${encodedNFA}&allowEpsilon=true`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading Complex NFA Example...</p>
    </div>
  );
} 