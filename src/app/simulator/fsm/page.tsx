'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../../simulators/fsm/AutomataSimulator';

interface AutomataSimulatorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function TMSimulatorPage({ searchParams }: AutomataSimulatorPageProps) {
  const [simulatorType] = useState<'MooreMachine'>('MooreMachine');
  
  // Get the machine from URL parameters if available
  const mooreParam = searchParams?.moore as string | undefined;
  
  return (
    <>
      {simulatorType === 'MooreMachine' && <AutomataSimulator initialMachine={mooreParam} />}
    </>
  );
}