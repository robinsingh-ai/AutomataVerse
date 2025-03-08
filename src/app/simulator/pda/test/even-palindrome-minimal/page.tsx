'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Minimal PDA for even palindromes - specifically optimized for "abba"
const evenPalindromePDA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "transitions": [
        {
          "targetid": "q1",
          "label": "a,Z,aZ"  // Read first 'a'
        }
      ]
    },
    {
      "id": "q1",
      "x": 200,
      "y": 150,
      "transitions": [
        {
          "targetid": "q2",
          "label": "b,a,ba"  // Read first 'b'
        }
      ]
    },
    {
      "id": "q2",
      "x": 300,
      "y": 150,
      "transitions": [
        {
          "targetid": "q3",
          "label": "b,b,ε"   // Read second 'b', pop 'b'
        }
      ]
    },
    {
      "id": "q3",
      "x": 400,
      "y": 150,
      "transitions": [
        {
          "targetid": "q4",
          "label": "a,a,ε"   // Read second 'a', pop 'a'
        }
      ]
    },
    {
      "id": "q4",
      "x": 500,
      "y": 150,
      "transitions": [
        {
          "targetid": "q5",
          "label": "ε,Z,Z"   // Accept when Z is left
        }
      ]
    },
    {
      "id": "q5",
      "x": 600,
      "y": 150,
      "transitions": []      // Accept state
    }
  ],
  "finalStates": ["q5"]
};

export default function EvenPalindromePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the PDA simulator with the minimal even palindrome PDA
    const encodedPDA = encodeURIComponent(JSON.stringify(evenPalindromePDA));
    router.push(`/simulator/pda?pda=${encodedPDA}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading Minimal PDA Example: Even Palindrome (abba)...</p>
    </div>
  );
} 