'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Enhanced PDA that accepts balanced parentheses with better epsilon handling
const balancedParenthesesPDA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "transitions": [
        {
          "targetid": "q0",
          "label": "(,Z,(Z"  // On '(', pop Z, push ( then Z
        },
        {
          "targetid": "q0",
          "label": "(,(,(("  // On '(', pop (, push ( then (
        },
        {
          "targetid": "q0",
          "label": "),(,ε"   // On ')', pop (, push nothing
        },
        {
          "targetid": "q1",
          "label": "ε,Z,Z"   // When only Z is left on stack (stack is empty)
        }
      ]
    },
    {
      "id": "q1",
      "x": 250,
      "y": 150,
      "transitions": []
    }
  ],
  "finalStates": ["q1"]
};

export default function ParenthesesPDAPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the PDA simulator with the balanced parentheses PDA
    const encodedPDA = encodeURIComponent(JSON.stringify(balancedParenthesesPDA));
    router.push(`/simulator/pda?pda=${encodedPDA}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading PDA Example 2: Balanced Parentheses...</p>
    </div>
  );
}