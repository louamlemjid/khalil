// src/app/api/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifySupabaseToken } from '@/lib/auth'; // Ensure this points to the updated lib/auth.ts
import { Role } from '@/lib/types'; // Import Role type

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    const { allowedRoles: rawAllowedRoles } = await req.json();
    if (!Array.isArray(rawAllowedRoles) || rawAllowedRoles.length === 0) {
      return NextResponse.json(
        { success: false, message: 'allowedRoles must be a non-empty array' },
        { status: 400 }
      );
    }

    // Type assertion for allowedRoles
    const allowedRoles: Role[] = rawAllowedRoles as Role[];

    const validRoles: Role[] = ['caisse', 'manager', 'stock_manager']; // Using Role type
    if (!allowedRoles.every((role: Role) => validRoles.includes(role))) {
      return NextResponse.json(
        { success: false, message: 'Invalid role in allowedRoles' },
        { status: 400 }
      );
    }

    const userData = await verifySupabaseToken(token); // userData is of type Utilisateur

    if (!allowedRoles.includes(userData.role)) {
      return NextResponse.json(
        { success: false, message: `Unauthorized: Role '${userData.role}' not allowed` },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        nom: userData.nom, // Confirm 'nom' exists on Utilisateur type returned by verifySupabaseToken
        email: userData.email,
        role: userData.role,
        date_creation: userData.date_creation,
      },
    });
  } catch (error) {
    console.error('Validation error in API route:', error);
    const message = error instanceof Error ? error.message : 'An error occurred during validation';
    const status = message.includes('Invalid or expired token') || message.includes('User profile not found') ? 401 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}