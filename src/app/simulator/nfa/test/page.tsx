'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Sample ε-NFA that accepts strings ending with 'ab'
const sampleNFA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "transitions": [
        {
          "targetid": "q0",
          "label": "a"
        },
        {
          "targetid": "q0",
          "label": "b"
        },
        {
          "targetid": "q1",
          "label": "a"
        }
      ]
    },
    {
      "id": "q1",
      "x": 250,
      "y": 150,
      "transitions": [
        {
          "targetid": "q2",
          "label": "b"
        },
        {
          "targetid": "q0",
          "label": "ε" // Epsilon transition back to q0
        }
      ]
    },
    {
      "id": "q2",
      "x": 400,
      "y": 150,
      "transitions": [
        {
          "targetid": "q0",
          "label": "ε" // Epsilon transition back to q0
        }
      ]
    }
  ],
  "finalStates": ["q2"],
  "allowEpsilon": true
};

export default function ExampleWithEpsilon() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the NFA simulator with the sample NFA
    const encodedNFA = encodeURIComponent(JSON.stringify(sampleNFA));
    router.push(`/simulator/nfa?nfa=${encodedNFA}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading ε-NFA Example: Strings ending with 'ab'...</p>
    </div>
  );
}