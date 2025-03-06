import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // In a server-side logout, we don't need to do much
    // The client will handle clearing the Firebase auth state
    // We just need to return a success response
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error: unknown) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to logout' },
      { status: 500 }
    );
  }
} 