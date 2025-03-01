'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// NFA that accepts strings ending with "ab"
const sampleNFA = {
  "nodes": [
    {
      "id": "q0",
      "x": 100,
      "y": 100,
      "transitions": [
        {
          "targetid": "q0",
          "label": "a,b"
        },
        {
          "targetid": "q1",
          "label": "a"
        }
      ]
    },
    {
      "id": "q1",
      "x": 250,
      "y": 100,
      "transitions": [
        {
          "targetid": "q2",
          "label": "b"
        }
      ]
    },
    {
      "id": "q2",
      "x": 400,
      "y": 100,
      "transitions": [
        {
          "targetid": "q0",
          "label": "a,b"
        },
        {
          "targetid": "q1",
          "label": "a"
        }
      ]
    }
  ],
  "finalStates": ["q2"]
};

// const epsilonNFA = {
//   "nodes": [
//     {
//       "id": "q0",
//       "x": 100,
//       "y": 100,
//       "transitions": [
//         {
//           "targetid": "q0",
//           "label": "a,b"
//         },
//         {
//           "targetid": "q1",
//           "label": "a"
//         },
//         {
//           "targetid": "q3",
//           "label": "ε"
//         }
//       ]
//     },
//     {
//       "id": "q1",
//       "x": 250,
//       "y": 50,
//       "transitions": [
//         {
//           "targetid": "q2",
//           "label": "b"
//         }
//       ]
//     },
//     {
//       "id": "q2",
//       "x": 400,
//       "y": 50,
//       "transitions": []
//     },
//     {
//       "id": "q3",
//       "x": 250,
//       "y": 150,
//       "transitions": [
//         {
//           "targetid": "q4",
//           "label": "a"
//         }
//       ]
//     },
//     {
//       "id": "q4",
//       "x": 400,
//       "y": 150,
//       "transitions": [
//         {
//           "targetid": "q5",
//           "label": "b"
//         }
//       ]
//     },
//     {
//       "id": "q5",
//       "x": 550,
//       "y": 150,
//       "transitions": []
//     }
//   ],
//   "finalStates": ["q2", "q5"]
// };

export default function TestNFAPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the NFA simulator with the sample NFA
    const encodedNFA = encodeURIComponent(JSON.stringify(sampleNFA));

    
    router.push(`/simulator/nfa?nfa=${encodedNFA}`);
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Redirecting to NFA Simulator with sample NFA for strings ending with &quot;ab&quot;...</p>
    </div>
  );
}