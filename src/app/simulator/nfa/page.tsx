'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../../simulators/nfa/AutomataSimulator';

interface NFASimulatorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function NFASimulatorPage({ searchParams }: NFASimulatorPageProps) {
  const [simulatorType] = useState<'Automata'>('Automata');
  
  // Get the DFA from URL parameters if available
  const nfaParam = searchParams?.nfa as string | undefined;
  
  return (
    <>
      {simulatorType === 'Automata' && <AutomataSimulator initialNFA={nfaParam} />}
    </>
  );
} 