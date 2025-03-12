'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../../simulators/pda/AutomataSimulator';

interface PDASimulatorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function PDASimulatorPage({ searchParams }: PDASimulatorPageProps) {
  const [simulatorType] = useState<'Automata'>('Automata');
  
  // Get the PDA from URL parameters if available
  const pdaParam = searchParams?.pda as string | undefined;
  
  // Get problem ID if coming from learning page
  const problemId = searchParams?.problem as string | undefined;
  
  return (
    <>
      {simulatorType === 'Automata' && (
        <AutomataSimulator 
          initialPDA={pdaParam} 
          problemId={problemId}
        />
      )}
    </>
  );
} 