// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, motDePasse } = await req.json();
    console.log('Login attempt with email:', email);

    if (!email || !motDePasse) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (authError || !authData.user || !authData.session) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from('utilisateur')
      .select('id, nom, role, date_creation, email') // Ensure 'role' here is the actual role string
      .eq('auth_user_id', authData.user.id)
      .single();

    if (userError || !userData) {
      console.error('Supabase user query error:', userError);
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        nom: userData.nom,
        email: userData.email, // Use email from userData if it's there, otherwise authData.user.email
        role: userData.role, // role_type: 'caisse', 'manager', or 'stock_manager'
        date_creation: userData.date_creation,
      },
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_in: authData.session.expires_in,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}