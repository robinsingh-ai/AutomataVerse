'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// NFA that demonstrates non-deterministic behavior
// This NFA accepts strings that either:
// 1. End with "ab" OR
// 2. Contain the substring "aba"
const nonDeterministicNFA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "transitions": [
        {
          "targetid": "q0",
          "label": "a"  // Self-loop to consume 'a'
        },
        {
          "targetid": "q0",
          "label": "b"  // Self-loop to consume 'b'
        },
        {
          "targetid": "q1",
          "label": "a"  // Non-deterministically move to q1 on 'a'
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
          "label": "b"  // Move to q2 on 'b'
        }
      ]
    },
    {
      "id": "q2",
      "x": 400,
      "y": 100,
      "transitions": [
        {
          "targetid": "q3",
          "label": "a"  // Move to q3 on 'a' (for "aba" pattern)
        }
      ]
    },
    {
      "id": "q3",
      "x": 550,
      "y": 100,
      "transitions": [
        {
          "targetid": "q4",
          "label": "ε"  // Epsilon transition to accepting state
        }
      ]
    },
    {
      "id": "q4",
      "x": 700,
      "y": 100,
      "transitions": []
    }
  ],
  "finalStates": ["q2", "q4"],  // Accept strings ending with "ab" or containing "aba"
  "allowEpsilon": true  // Explicitly allow epsilon transitions
};

export default function NonDeterministicExamplePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the NFA simulator with the non-deterministic NFA
    const encodedNFA = encodeURIComponent(JSON.stringify(nonDeterministicNFA));
    router.push(`/simulator/nfa?nfa=${encodedNFA}&allowEpsilon=true`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading Non-Deterministic NFA Example...</p>
    </div>
  );
} 