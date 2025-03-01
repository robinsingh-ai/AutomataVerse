'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../../simulators/dfa/AutomataSimulator';

interface DFASimulatorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function DFASimulatorPage({ searchParams }: DFASimulatorPageProps) {
  const [simulatorType] = useState<'Automata'>('Automata');
  
  // Get the DFA from URL parameters if available
  const dfaParam = searchParams?.dfa as string | undefined;
  
  return (
    <>
      {simulatorType === 'Automata' && <AutomataSimulator initialDFA={dfaParam} />}
    </>
  );
} 