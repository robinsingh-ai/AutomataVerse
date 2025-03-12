'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../../simulators/tm/AutomataSimulator';

interface AutomataSimulatorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function TMSimulatorPage({ searchParams }: AutomataSimulatorPageProps) {
  const [simulatorType] = useState<'TuringMachine'>('TuringMachine');
  
  // Get the TM from URL parameters if available
  const tmParam = searchParams?.tm as string | undefined;
  // Get the problem ID from URL parameters if available
  const problemId = searchParams?.problem as string | undefined;
  
  return (
    <>
      {simulatorType === 'TuringMachine' && <AutomataSimulator initialTM={tmParam} problemId={problemId} />}
    </>
  );
}