import { NextResponse } from 'next/server';
import { PDA_PROBLEMS } from '../../../../simulators/pda/problemsets/problems';

export async function GET() {
  // Check if PDA_PROBLEMS is actually defined
  if (!PDA_PROBLEMS) {
    return NextResponse.json({ error: 'PDA_PROBLEMS is undefined', keys: 'None' });
  }
  
  // Get the keys of PDA_PROBLEMS to see if the object structure is correct
  const keys = Object.keys(PDA_PROBLEMS);
  
  // Return raw information about PDA problems
  return NextResponse.json({
    keys,
    problemCount: keys.length,
    problemsExist: keys.length > 0,
    firstProblem: keys.length > 0 ? PDA_PROBLEMS[keys[0]] : null,
    allProblems: PDA_PROBLEMS
  });
} 