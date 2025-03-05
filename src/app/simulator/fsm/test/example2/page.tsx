'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Sample Mealy Machine that detects the parity of 1s in a binary string
const sampleMealyMachine = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 150,
      "output": "",
      "transitions": [
        { "targetid": "q0", "inputSymbol": "0", "outputSymbol": "0" },
        { "targetid": "q1", "inputSymbol": "1", "outputSymbol": "0" }
      ]
    },
    {
      "id": "q1",
      "x": 200,
      "y": 150,
      "output": "",
      "transitions": [
        { "targetid": "q2", "inputSymbol": "0", "outputSymbol": "0" },
        { "targetid": "q1", "inputSymbol": "1", "outputSymbol": "0" }
      ]
    },
    {
      "id": "q2",
      "x": 300,
      "y": 150,
      "output": "",
      "transitions": [
        { "targetid": "q0", "inputSymbol": "0", "outputSymbol": "0" },
        { "targetid": "q0", "inputSymbol": "1", "outputSymbol": "1" } // Output 1 when pattern detected
      ]
    }
  ],
  "finalStates": [],
  "machineType": "Mealy"
};

export default function MealyExamplePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the FSM simulator with the sample Mealy Machine
    const encodedMachine = encodeURIComponent(JSON.stringify(sampleMealyMachine));
    router.push(`/simulator/fsm?machine=${encodedMachine}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading Mealy Machine Example: Parity detector for 1s...</p>
    </div>
  );
}