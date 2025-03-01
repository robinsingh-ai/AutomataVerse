'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Sample DFA that accepts strings with an even number of 0s and 1s
const sampleDFA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 100,
      "transitions": [
        {
          "targetid": "q1",
          "label": "0"
        },
        {
          "targetid": "q2",
          "label": "1"
        }
      ]
    },
    {
      "id": "q1",
      "x": 250,
      "y": 50,
      "transitions": [
        {
          "targetid": "q0",
          "label": "0"
        },
        {
          "targetid": "q3",
          "label": "1"
        }
      ]
    },
    {
      "id": "q2",
      "x": 250,
      "y": 150,
      "transitions": [
        {
          "targetid": "q3",
          "label": "0"
        },
        {
          "targetid": "q0",
          "label": "1"
        }
      ]
    },
    {
      "id": "q3",
      "x": 400,
      "y": 100,
      "transitions": [
        {
          "targetid": "q2",
          "label": "0"
        },
        {
          "targetid": "q1",
          "label": "1"
        }
      ]
    }
  ],
  "finalStates": ["q0"]
};

export default function TestDFAPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the DFA simulator with the sample DFA
    const encodedDFA = encodeURIComponent(JSON.stringify(sampleDFA));
    router.push(`/simulator/dfa?dfa=${encodedDFA}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Redirecting to DFA Simulator with sample DFA...</p>
    </div>
  );
} 