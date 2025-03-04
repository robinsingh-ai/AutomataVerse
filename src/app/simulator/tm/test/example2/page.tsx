'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// String Sorter TM (three-tape)
// This TM sorts characters in a string in ascending order
// Input string on the first tape
// Tape 2 is used for temporary storage
// Tape 3 will contain the sorted result
const stringSorterTM = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 200,
      "transitions": [
        // Initialization: Copy input to tape 2
        { "targetid": "q1", "label": "a,a,R;□,a,R;□,□,S" },
        { "targetid": "q1", "label": "b,b,R;□,b,R;□,□,S" },
        { "targetid": "q1", "label": "c,c,R;□,c,R;□,□,S" },
        // Empty input case, just accept
        { "targetid": "q8", "label": "□,□,S;□,□,S;□,□,S" }
      ]
    },
    {
      "id": "q1",
      "x": 300,
      "y": 200,
      "transitions": [
        // Continue copying input to tape 2
        { "targetid": "q1", "label": "a,a,R;□,a,R;□,□,S" },
        { "targetid": "q1", "label": "b,b,R;□,b,R;□,□,S" },
        { "targetid": "q1", "label": "c,c,R;□,c,R;□,□,S" },
        // End of input, move to sorting phase
        { "targetid": "q2", "label": "□,□,L;□,□,L;□,□,R" }
      ]
    },
    {
      "id": "q2",
      "x": 500,
      "y": 200,
      "transitions": [
        // Find smallest character (first 'a')
        { "targetid": "q3", "label": "□,a,S;a,□,L;□,a,R" },
        // If no 'a', then find first 'b'
        { "targetid": "q4", "label": "□,b,S;b,□,L;□,□,S" },
        // If no 'a' or 'b', then find first 'c'
        { "targetid": "q5", "label": "□,c,S;c,□,L;□,□,S" },
        // If no more characters on tape 2, we're done
        { "targetid": "q8", "label": "□,□,S;□,□,S;□,□,S" }
      ]
    },
    {
      "id": "q3",
      "x": 700,
      "y": 100,
      "transitions": [
        // Continue finding all 'a's
        { "targetid": "q3", "label": "□,a,S;a,□,L;□,a,R" },
        // Move to finding 'b's
        { "targetid": "q4", "label": "□,b,S;b,□,L;□,□,S" },
        // Move to finding 'c's
        { "targetid": "q5", "label": "□,c,S;c,□,L;□,□,S" },
        // No more characters on tape 2
        { "targetid": "q8", "label": "□,□,S;□,□,S;□,□,S" }
      ]
    },
    {
      "id": "q4",
      "x": 700,
      "y": 300,
      "transitions": [
        // Continue finding all 'b's
        { "targetid": "q4", "label": "□,b,S;b,□,L;□,b,R" },
        // Move to finding 'c's
        { "targetid": "q5", "label": "□,c,S;c,□,L;□,□,S" },
        // No more characters on tape 2
        { "targetid": "q8", "label": "□,□,S;□,□,S;□,□,S" }
      ]
    },
    {
      "id": "q5",
      "x": 700,
      "y": 500,
      "transitions": [
        // Continue finding all 'c's
        { "targetid": "q5", "label": "□,c,S;c,□,L;□,c,R" },
        // No more characters on tape 2
        { "targetid": "q8", "label": "□,□,S;□,□,S;□,□,S" }
      ]
    },
    {
      "id": "q7",
      "x": 900,
      "y": 400,
      "transitions": []
    },
    {
      "id": "q8",
      "x": 900,
      "y": 300,
      "transitions": []
    }
  ],
  "acceptStates": ["q8"],
  "rejectStates": ["q7"],
  "tapeCount": 3
};

export default function StringSorterPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the TM simulator with the string sorter TM
    const encodedTM = encodeURIComponent(JSON.stringify(stringSorterTM));
    router.push(`/simulator/tm?tm=${encodedTM}`);
  }, [router]);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-lg">Loading String Sorter TM Example (Three-Tape)...</p>
      <p className="text-sm mt-2">This TM sorts a string of characters ('a', 'b', 'c') in ascending order.</p>
      <p className="text-sm mt-1">Input string on first tape (e.g., "cba", "abcab", "cababc").</p>
      <p className="text-sm mt-1">Sorted result will appear on the third tape.</p>
    </div>
  );
}