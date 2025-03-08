'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// PDA that accepts even palindromes (like abba, aabbaa)
const evenPalindromePDA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "transitions": [
        {
          "targetid": "q1",
          "label": "ε,Z,Z"  // Initial transition to start processing
        }
      ]
    },
    {
      "id": "q1",
      "x": 250,
      "y": 150,
      "transitions": [
        {
          "targetid": "q1",
          "label": "a,Z,aZ"  // First 'a', push 'a' onto stack
        },
        {
          "targetid": "q1",
          "label": "b,Z,bZ"  // First 'b', push 'b' onto stack
        },
        {
          "targetid": "q1",
          "label": "a,a,aa"  // Another 'a', push 'a' onto stack
        },
        {
          "targetid": "q1",
          "label": "a,b,ab"  // 'a' after 'b', push 'a' onto stack
        },
        {
          "targetid": "q1",
          "label": "b,a,ba"  // 'b' after 'a', push 'b' onto stack
        },
        {
          "targetid": "q1",
          "label": "b,b,bb"  // Another 'b', push 'b' onto stack
        },
        {
          "targetid": "q2",
          "label": "ε,a,a"   // Non-deterministic choice to start matching
        },
        {
          "targetid": "q2",
          "label": "ε,b,b"   // Non-deterministic choice to start matching
        }
      ]
    },
    {
      "id": "q2",
      "x": 400,
      "y": 150,
      "transitions": [
        {
          "targetid": "q3",
          "label": "a,a,ε"   // Match 'a' with top of stack
        },
        {
          "targetid": "q3",
          "label": "b,b,ε"   // Match 'b' with top of stack
        }
      ]
    },
    {
      "id": "q3",
      "x": 550,
      "y": 150,
      "transitions": [
        {
          "targetid": "q3",
          "label": "a,a,ε"   // Continue matching 'a's
        },
        {
          "targetid": "q3",
          "label": "b,b,ε"   // Continue matching 'b's
        },
        {
          "targetid": "q4",
          "label": "ε,Z,Z"   // When stack has only 'Z' left and input is consumed
        }
      ]
    },
    {
      "id": "q4",
      "x": 700,
      "y": 150,
      "transitions": []
    }
  ],
  "finalStates": ["q4"]
};

export default function EvenPalindromePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the PDA simulator with the even palindrome PDA
    const encodedPDA = encodeURIComponent(JSON.stringify(evenPalindromePDA));
    router.push(`/simulator/pda?pda=${encodedPDA}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading PDA Example: Even Palindrome...</p>
    </div>
  );
} 