'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Simple NFA with epsilon transitions
// This NFA accepts strings that end with "a" or "b"
// It uses epsilon transitions to create alternative paths
const epsilonNFA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "transitions": [
        {
          "targetid": "q1",
          "label": "ε"  // Epsilon transition to q1
        },
        {
          "targetid": "q3",
          "label": "ε"  // Epsilon transition to q3
        }
      ]
    },
    {
      "id": "q1",
      "x": 250,
      "y": 100,
      "transitions": [
        {
          "targetid": "q1",
          "label": "a"  // Self loop on 'a'
        },
        {
          "targetid": "q2",
          "label": "a"  // Move to accepting state with 'a'
        }
      ]
    },
    {
      "id": "q2",
      "x": 400,
      "y": 100,
      "transitions": []  // Accepting state for strings ending with 'a'
    },
    {
      "id": "q3",
      "x": 250,
      "y": 200,
      "transitions": [
        {
          "targetid": "q3",
          "label": "b"  // Self loop on 'b'
        },
        {
          "targetid": "q4",
          "label": "b"  // Move to accepting state with 'b'
        }
      ]
    },
    {
      "id": "q4",
      "x": 400,
      "y": 200,
      "transitions": []  // Accepting state for strings ending with 'b'
    }
  ],
  "finalStates": ["q2", "q4"],  // Accept strings ending with 'a' or 'b'
  "allowEpsilon": true  // Explicitly allow epsilon transitions
};

export default function EpsilonNFAPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the NFA simulator with the epsilon NFA
    const encodedNFA = encodeURIComponent(JSON.stringify(epsilonNFA));
    router.push(`/simulator/nfa?nfa=${encodedNFA}&allowEpsilon=true`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading Epsilon NFA Example...</p>
    </div>
  );
} 