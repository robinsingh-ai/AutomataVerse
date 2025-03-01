'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Improved PDA that accepts the a^n b^n language
const samplePDA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "transitions": [
        {
          "targetid": "q1",
          "label": "a,Z,AZ"  // On 'a', pop Z, push A then Z
        },
        {
          "targetid": "q1",
          "label": "a,A,AA"  // On 'a', pop A, push A then A
        },
        {
          "targetid": "q3",
          "label": "ε,Z,Z"   // Empty string special case - directly accept
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
          "label": "a,A,AA"  // On 'a', pop A, push A then A
        },
        {
          "targetid": "q2",
          "label": "b,A,ε"   // On 'b', pop A, push nothing
        }
      ]
    },
    {
      "id": "q2",
      "x": 400,
      "y": 150,
      "transitions": [
        {
          "targetid": "q2",
          "label": "b,A,ε"   // On 'b', pop A, push nothing
        },
        {
          "targetid": "q3",
          "label": "ε,Z,Z"   // When done with all As and the last symbol on stack is Z
        }
      ]
    },
    {
      "id": "q3",
      "x": 550,
      "y": 150,
      "transitions": []
    }
  ],
  "finalStates": ["q3"]
};

export default function Example1Page() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the PDA simulator with the sample PDA
    const encodedPDA = encodeURIComponent(JSON.stringify(samplePDA));
    router.push(`/simulator/pda?pda=${encodedPDA}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading PDA Example 1: a^n b^n language...</p>
    </div>
  );
}