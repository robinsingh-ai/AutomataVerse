'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../../simulators/fsm/AutomataSimulator';

interface AutomataSimulatorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function FSMSimulatorPage({ searchParams }: AutomataSimulatorPageProps) {
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