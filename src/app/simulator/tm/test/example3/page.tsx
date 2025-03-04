"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const BinaryAdditionTM = {
  nodes: [
    {
      id: "q0",
      x: 57,
      y: 284,
      transitions: [
        { targetid: "q0", label: "0,□,R;□,0,R" },
        { targetid: "q0", label: "1,□,R;□,1,R" },
        { targetid: "q1", label: "c,□,R;□,□,S" },
      ],
    },
    {
      id: "q1",
      x: 422,
      y: 264,
      transitions: [
        { targetid: "q1", label: "0,0,R;□,□,S" },
        { targetid: "q1", label: "1,1,R;□,□,S" },
        { targetid: "q2", label: "□,□,L;□,□,L" },
      ],
    },
    {
      id: "q2",
      x: 746,
      y: 280,
      transitions: [
        { targetid: "q2", label: "0,0,L;0,□,L" },
        { targetid: "q2", label: "0,1,L;1,□,L" },
        { targetid: "q2", label: "1,1,L;0,□,L" },
        { targetid: "q2", label: "□,1,L;1,□,L" },
        { targetid: "q2", label: "1,1,L;□,□,L" },
        { targetid: "q3", label: "1,0,L;1,□,L" },
        { targetid: "q4", label: "□,□,S;□,□,S" },
      ],
    },
    {
      id: "q3",
      x: 1090,
      y: 388,
      transitions: [
        { targetid: "q2", label: "0,1,L;0,□,L" },
        { targetid: "q3", label: "0,0,L;1,□,L" },
        { targetid: "q3", label: "1,0,L;0,□,L" },
        { targetid: "q3", label: "1,1,L;1,□,L" },
        { targetid: "q3", label: "□,0,L;1,□,L" },
        { targetid: "q3", label: "1,0,L;□,□,L" },
        { targetid: "q4", label: "□,1,L;□,□,L" },
      ],
    },
    { id: "q4", x: 511, y: 572, transitions: [] },
  ],
  finalStates: ["q4"],
  tapeMode: "2-tape",
};

export default function Example2Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the PDA simulator with the balanced parentheses PDA
    const encodedTM = encodeURIComponent(JSON.stringify(BinaryAdditionTM));
    router.push(`/simulator/tm?tm=${encodedTM}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading PM Example 2: Binary Adder...</p>
    </div>
  );
}
