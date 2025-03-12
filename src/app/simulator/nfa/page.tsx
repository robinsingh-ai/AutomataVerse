'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../../simulators/nfa/AutomataSimulator';

interface NFASimulatorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function NFASimulatorPage({ searchParams }: NFASimulatorPageProps) {
  const [simulatorType] = useState<'Automata'>('Automata');
  
  // Get the NFA from URL parameters if available
  const nfaParam = searchParams?.nfa as string | undefined;
  
  // Get problem ID if coming from learning page
  const problemId = searchParams?.problem as string | undefined;
  
  return (
    <>
      {simulatorType === 'Automata' && (
        <AutomataSimulator 
          initialNFA={nfaParam} 
          problemId={problemId}
        />
      )}
    </>
  );
} 