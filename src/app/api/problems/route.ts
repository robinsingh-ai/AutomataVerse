import { NextResponse } from 'next/server';
import { DFA_PROBLEMS } from '../../../simulators/dfa/problemsets/problems';
import { NFA_PROBLEMS } from '../../../simulators/nfa/problemsets/problems';
import { PDA_PROBLEMS } from '../../../simulators/pda/problemsets/problems';
import { TM_PROBLEMS } from '../../../simulators/tm/problemsets/problems';
import fsmProblems from '../../../simulators/fsm/problemsets/problems';

// This route serves DFA, NFA, PDA, TM, and FSM problems without the accept/reject arrays
// to avoid revealing the answers to users
export async function GET() {
  // Create sanitized versions of DFA problems
  const sanitizedDFAProblems = Object.entries(DFA_PROBLEMS).map(([key, problem]) => {
    // Extract all props except accept and reject
    const { accept, reject, ...sanitizedProblem } = problem;
    // Add type indicator
    return {
      ...sanitizedProblem,
      type: 'dfa',
      id: key
    };
  });

  // Create sanitized versions of NFA problems
  const sanitizedNFAProblems = Object.entries(NFA_PROBLEMS).map(([key, problem]) => {
    // Extract all props except accept and reject
    const { accept, reject, ...sanitizedProblem } = problem;
    // Add type indicator
    return {
      ...sanitizedProblem,
      type: 'nfa',
      id: key
    };
  });

  // Create sanitized versions of PDA problems
  const sanitizedPDAProblems = Object.entries(PDA_PROBLEMS).map(([key, problem]) => {
    // Extract all props except accept and reject
    const { accept, reject, ...sanitizedProblem } = problem;
    // Add type indicator
    return {
      ...sanitizedProblem,
      type: 'pda',
      id: key
    };
  });
  
  // Create sanitized versions of TM problems
  const sanitizedTMProblems = Object.entries(TM_PROBLEMS).map(([key, problem]) => {
    // Extract all props except accept and reject
    const { accept, reject, ...sanitizedProblem } = problem;
    // Add type indicator
    return {
      ...sanitizedProblem,
      type: 'tm',
      id: key
    };
  });

  // Create sanitized versions of FSM problems
  const sanitizedFSMProblems = fsmProblems.map((problem) => {
    // Extract solution and include machine type
    const { solution, ...sanitizedProblem } = problem;
    // Add type indicator
    return {
      ...sanitizedProblem,
      type: 'fsm',
      difficulty: problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) as "Easy" | "Medium" | "Hard"
    };
  });

  // Combine all problem sets
  const allProblems = [
    ...sanitizedDFAProblems, 
    ...sanitizedNFAProblems, 
    ...sanitizedPDAProblems,
    ...sanitizedTMProblems,
    ...sanitizedFSMProblems
  ];

  // Return structured response with all problem types
  return NextResponse.json({
    problems: allProblems,
    count: allProblems.length,
    types: {
      dfa: sanitizedDFAProblems.length,
      nfa: sanitizedNFAProblems.length,
      pda: sanitizedPDAProblems.length,
      tm: sanitizedTMProblems.length,
      fsm: sanitizedFSMProblems.length
    }
  });
} 