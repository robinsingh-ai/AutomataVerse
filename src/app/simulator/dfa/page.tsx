'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../../simulators/dfa/AutomataSimulator';

export default function DFASimulatorPage() {
  const [simulatorType] = useState<'Automata'>('Automata');

  return (
    <>
      {simulatorType === 'Automata' && <AutomataSimulator />}
    </>
  );
} 