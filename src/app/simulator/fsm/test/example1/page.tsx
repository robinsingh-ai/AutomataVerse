'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Sample Moore Machine that outputs the parity of 1s seen so far
const sampleMooreMachine = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "output": "0", // Haven't seen any part of pattern
      "transitions": [
        { "targetid": "q0", "inputSymbol": "0" },
        { "targetid": "q1", "inputSymbol": "1" }
      ]
    },
    {
      "id": "q1",
      "x": 200,
      "y": 150,
      "output": "0", // Seen "1"
      "transitions": [
        { "targetid": "q2", "inputSymbol": "0" },
        { "targetid": "q1", "inputSymbol": "1" }
      ]
    },
    {
      "id": "q2",
      "x": 300,
      "y": 150,
      "output": "0", // Seen "10"
      "transitions": [
        { "targetid": "q0", "inputSymbol": "0" },
        { "targetid": "q3", "inputSymbol": "1" }
      ]
    },
    {
      "id": "q3",
      "x": 400,
      "y": 150,
      "output": "1", // Seen "101" - Pattern detected!
      "transitions": [
        { "targetid": "q2", "inputSymbol": "0" },
        { "targetid": "q1", "inputSymbol": "1" }
      ]
    }
  ],
  "finalStates": ["q3"],
  "machineType": "Moore"
};

export default function MooreExamplePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the Moore Machine simulator with the sample machine
    const encodedMachine = encodeURIComponent(JSON.stringify(sampleMooreMachine));
    router.push(`/simulator/fsm?machine=${encodedMachine}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading Moore Machine Example: 101 detector...</p>
    </div>
  );
}