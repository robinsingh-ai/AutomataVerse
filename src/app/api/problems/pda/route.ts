import { NextResponse } from 'next/server';
import { PDA_PROBLEMS } from '../../../../simulators/pda/problemsets/problems';

// This route serves the PDA problems without the accept/reject arrays
// to avoid revealing the answers to users
export async function GET() {
  // Create a sanitized version of the problems without answers
  const sanitizedProblems = Object.fromEntries(
    Object.entries(PDA_PROBLEMS).map(([key, problem]) => {
      // Extract all props except accept and reject
      const { accept, reject, ...sanitizedProblem } = problem;
      return [key, sanitizedProblem];
    })
  );

  return NextResponse.json(sanitizedProblems);
} 