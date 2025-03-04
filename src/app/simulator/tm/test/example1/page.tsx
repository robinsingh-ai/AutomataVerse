"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";


const TripletCheckerTM = {
  nodes: [
    {
      id: "q0",
      x: 288,
      y: 276.5,
      transitions: [
        { targetid: "q1", label: "a,x,R" },
        { targetid: "q4", label: "y,y,R" },
      ],
    },
    {
      id: "q1",
      x: 653,
      y: 275.5,
      transitions: [
        { targetid: "q1", label: "a,a,R" },
        { targetid: "q1", label: "y,y,R" },
        { targetid: "q2", label: "b,y,R" },
      ],
    },
    {
      id: "q2",
      x: 993,
      y: 275.5,
      transitions: [
        { targetid: "q2", label: "b,b,R" },
        { targetid: "q2", label: "z,z,R" },
        { targetid: "q3", label: "c,z,L" },
      ],
    },
    {
      id: "q3",
      x: 1221,
      y: 569.5,
      transitions: [
        { targetid: "q3", label: "z,z,L" },
        { targetid: "q3", label: "b,b,L" },
        { targetid: "q3", label: "y,y,L" },
        { targetid: "q3", label: "a,a,L" },
        { targetid: "q0", label: "x,x,R" },
      ],
    },
    {
      id: "q4",
      x: 37,
      y: 592.5,
      transitions: [
        { targetid: "q4", label: "y,y,R" },
        { targetid: "q4", label: "z,z,R" },
        { targetid: "q5", label: "_,_,R" },
      ],
    },
    { id: "q5", x: 451, y: 599.5, transitions: [] },
  ],
  finalStates: ["q5"],
  tapeCount: 1,
};

export default function PalindromeCheckerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the TM simulator with the palindrome checker TM
    const encodedTM = encodeURIComponent(JSON.stringify(TripletCheckerTM));
    router.push(`/simulator/tm?tm=${encodedTM}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading TM Example 1: a^n b^n c^n language...</p>
    </div>
  );
}
