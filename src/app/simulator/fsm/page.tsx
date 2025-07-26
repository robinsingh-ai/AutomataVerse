'use client';

import React, { useState, Suspense } from 'react';
import AutomataSimulator from '../../../simulators/fsm/AutomataSimulator';

interface AutomataSimulatorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

function FSMSimulatorContent({ searchParams }: AutomataSimulatorPageProps) {
  const [simulatorType] = useState<'FSM'>('FSM');
  
  // Get the machine or problem ID from URL parameters if available
  const mooreParam = searchParams?.moore as string | undefined;
  const problemId = searchParams?.problem as string | undefined;
  
  return (
    <>
      {simulatorType === 'FSM' && (
        <AutomataSimulator 
          initialMachine={mooreParam}
          problemId={problemId}
        />
      )}
    </>
  );
}

export default function FSMSimulatorPage({ searchParams }: AutomataSimulatorPageProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading FSM Simulator...</div>}>
      <FSMSimulatorContent searchParams={searchParams} />
    </Suspense>
  );
}
