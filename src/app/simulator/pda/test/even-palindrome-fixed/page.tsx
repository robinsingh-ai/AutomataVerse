'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// PDA for even palindromes with a deterministic approach
// Designed specifically for the pattern: first half, then second half
const evenPalindromePDA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "transitions": [
        {
          "targetid": "q1",
          "label": "a,Z,XZ"  // When we see 'a', push marker X and bottom marker Z
        },
        {
          "targetid": "q2",
          "label": "b,Z,YZ"  // When we see 'b', push marker Y and bottom marker Z
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
          "label": "a,X,XX"  // Push marker X for each 'a' in first half
        },
        {
          "targetid": "q1",
          "label": "a,Y,XY"  // Push marker X over Y for 'a'
        },
        {
          "targetid": "q2",
          "label": "b,X,YX"  // Push marker Y over X for 'b'
        },
        {
          "targetid": "q2",
          "label": "b,Y,YY"  // Push marker Y for each 'b' in first half
        },
        {
          "targetid": "q3",
          "label": "a,X,ε"   // Start second half: match 'a' with X
        }
      ]
    },
    {
      "id": "q2",
      "x": 250,
      "y": 200,
      "transitions": [
        {
          "targetid": "q1",
          "label": "a,X,XX"  // Push marker X for each 'a' in first half
        },
        {
          "targetid": "q1",
          "label": "a,Y,XY"  // Push marker X over Y for 'a'
        },
        {
          "targetid": "q2",
          "label": "b,X,YX"  // Push marker Y over X for 'b'
        },
        {
          "targetid": "q2",
          "label": "b,Y,YY"  // Push marker Y for each 'b' in first half
        },
        {
          "targetid": "q4",
          "label": "b,Y,ε"   // Start second half: match 'b' with Y
        }
      ]
    },
    {
      "id": "q3",
      "x": 400,
      "y": 100,
      "transitions": [
        {
          "targetid": "q3",
          "label": "a,X,ε"   // Match 'a' with marker X
        },
        {
          "targetid": "q4",
          "label": "b,Y,ε"   // Match 'b' with marker Y
        },
        {
          "targetid": "q5",
          "label": "ε,Z,Z"   // When only Z remains on stack
        }
      ]
    },
    {
      "id": "q4",
      "x": 400,
      "y": 200,
      "transitions": [
        {
          "targetid": "q3",
          "label": "a,X,ε"   // Match 'a' with marker X
        },
        {
          "targetid": "q4",
          "label": "b,Y,ε"   // Match 'b' with marker Y
        },
        {
          "targetid": "q5",
          "label": "ε,Z,Z"   // When only Z remains on stack
        }
      ]
    },
    {
      "id": "q5",
      "x": 550,
      "y": 150,
      "transitions": []      // Accept state
    }
  ],
  "finalStates": ["q5"]
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
      <p className="text-lg">Loading Fixed PDA Example: Even Palindrome...</p>
    </div>
  );
} 