'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Simplified PDA for even palindromes - more straightforward design
const evenPalindromePDA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 200,
      "transitions": [
        {
          "targetid": "q1",
          "label": "a,Z,aZ"  // Read 'a', push 'a' to stack
        },
        {
          "targetid": "q1",
          "label": "b,Z,bZ"  // Read 'b', push 'b' to stack
        }
      ]
    },
    {
      "id": "q1",
      "x": 250,
      "y": 200,
      "transitions": [
        {
          "targetid": "q1",
          "label": "a,Z,aZ"  // Read 'a', push 'a' to stack
        },
        {
          "targetid": "q1",
          "label": "a,a,aa"  // Read 'a', push another 'a'
        },
        {
          "targetid": "q1",
          "label": "a,b,ab"  // Read 'a', push 'a' on top of 'b'
        },
        {
          "targetid": "q1",
          "label": "b,Z,bZ"  // Read 'b', push 'b' to stack
        },
        {
          "targetid": "q1",
          "label": "b,a,ba"  // Read 'b', push 'b' on top of 'a'
        },
        {
          "targetid": "q1",
          "label": "b,b,bb"  // Read 'b', push another 'b'
        },
        {
          "targetid": "q2",
          "label": "a,a,ε"   // Start second half: read 'a', match with 'a'
        },
        {
          "targetid": "q2",
          "label": "b,b,ε"   // Start second half: read 'b', match with 'b'
        }
      ]
    },
    {
      "id": "q2",
      "x": 400,
      "y": 200,
      "transitions": [
        {
          "targetid": "q2",
          "label": "a,a,ε"   // Read 'a', match with 'a' on stack
        },
        {
          "targetid": "q2",
          "label": "b,b,ε"   // Read 'b', match with 'b' on stack
        },
        {
          "targetid": "q3",
          "label": "ε,Z,Z"   // When only Z remains on stack
        }
      ]
    },
    {
      "id": "q3",
      "x": 550,
      "y": 200,
      "transitions": []      // Accept state
    }
  ],
  "finalStates": ["q3"]
};

export default function EvenPalindromePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the PDA simulator with the simplified even palindrome PDA
    const encodedPDA = encodeURIComponent(JSON.stringify(evenPalindromePDA));
    router.push(`/simulator/pda?pda=${encodedPDA}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading Simplified PDA Example: Even Palindrome...</p>
    </div>
  );
} 