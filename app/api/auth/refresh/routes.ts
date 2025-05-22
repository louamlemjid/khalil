// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { refreshSessionServer } from '@/lib/auth'; // Import the server-side refresh function

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { refresh_token } = await req.json();

    if (!refresh_token) {
      return NextResponse.json(
        { success: false, message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    const { access_token, refresh_token: new_refresh_token, expires_in } = await refreshSessionServer(refresh_token);

    return NextResponse.json({
      success: true,
      access_token,
      refresh_token: new_refresh_token,
      expires_in,
    });
  } catch (error) {
    console.error('API refresh error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred during session refresh';
    const status = message.includes('Failed to refresh session') ? 401 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}