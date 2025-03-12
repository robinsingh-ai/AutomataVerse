import { NextRequest, NextResponse } from 'next/server';
import { TM_PROBLEMS } from '../../../../simulators/tm/problemsets/problems';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const problemId = searchParams.get('id');

  if (!problemId) {
    // If no ID is provided, return all TM problems
    return NextResponse.json({
      problems: TM_PROBLEMS,
      count: Object.keys(TM_PROBLEMS).length
    });
  }

  // Get the problem by ID
  const problem = TM_PROBLEMS[problemId];

  if (!problem) {
    return NextResponse.json(
      { error: `Problem with ID "${problemId}" not found` },
      { status: 404 }
    );
  }

  // Return the full problem (including accept/reject arrays)
  return NextResponse.json({ problem });
} 