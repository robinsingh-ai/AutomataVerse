import { NextResponse } from 'next/server';
import { DFA_PROBLEMS } from '../../../simulators/dfa/problemsets/problems';

// This route serves the DFA problems without the accept/reject arrays
// to avoid revealing the answers to users
export async function GET() {
  // Create a sanitized version of the problems without answers
  const sanitizedProblems = Object.fromEntries(
    Object.entries(DFA_PROBLEMS).map(([key, problem]) => {
      // Extract all props except accept and reject
      const { accept, reject, ...sanitizedProblem } = problem;
      return [key, sanitizedProblem];
    })
  );

  return NextResponse.json(sanitizedProblems);
} 