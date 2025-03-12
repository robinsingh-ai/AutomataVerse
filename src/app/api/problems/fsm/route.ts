import { NextResponse } from 'next/server';
import fsmProblems from '../../../../simulators/fsm/problemsets/problems';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  try {
    if (id) {
      // If an ID is provided, return the specific problem
      const problem = fsmProblems.find(p => p.id === id);
      
      if (!problem) {
        return NextResponse.json(
          { error: `Problem with ID ${id} not found` },
          { status: 404 }
        );
      }
      
      return NextResponse.json(problem);
    } else {
      // Otherwise, return a list of all problems (without solutions)
      const problemSummaries = fsmProblems.map(({ id, title, description, machineType, difficulty }) => ({
        id,
        title,
        description,
        machineType,
        difficulty
      }));
      
      return NextResponse.json(problemSummaries);
    }
  } catch (error) {
    console.error('Error fetching FSM problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FSM problems' },
      { status: 500 }
    );
  }
} 