// src/lib/auth.ts
// This file will now be exclusively for server-side functions that interact directly with Supabase.
// Client-side authentication state and checks will use AuthContext.

import { supabase } from '@/lib/db'; // Assuming '@/lib/db' correctly exports your Supabase client
import type { Utilisateur, Role } from '@/lib/types'; // Using Utilisateur as defined for DB interaction

export async function verifySupabaseToken(token: string): Promise<Utilisateur> {
  try {
    // You should *not* use getUser(token) directly if the token is a full JWT from the client.
    // supabase.auth.getUser() is meant for server-side context where you have the actual session,
    // or to verify a token that Supabase itself provides.
    // For verifying a token passed from the client, you'd typically use a method that decodes and validates the JWT.
    // Supabase's `auth.api.getUser()` (if you were using the old `supabase-js` v1) or a custom JWT verification.
    // Given you already have a `user` property in `data` from `supabase.auth.getUser(token)`,
    // it implies `getUser` is working for you, so we'll stick with it, but be aware of its nuances.
    // The most secure approach for token validation on the server is to verify the JWT signature.
    // However, if your `supabase.auth.getUser(token)` correctly extracts the user from the JWT and
    // validates it, it's fine.

    // Corrected to reflect typical use of getUser for validating a token and fetching the *auth* user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      console.error('Supabase auth.getUser error:', authError?.message);
      throw new Error('Invalid or expired token');
    }

    // Fetch user data from your custom 'utilisateur' table
    const { data: userData, error: userError } = await supabase
      .from('utilisateur')
      .select('id, nom, role:role_id, date_creation, email') // Assuming role is a string directly here, not a foreign key
      .eq('auth_user_id', authUser.id)
      .single();

    if (userError || !userData) {
      console.error('Supabase utilisateur query error:', userError?.message);
      throw new Error('User profile not found');
    }

    // IMPORTANT: Ensure 'role' property on 'userData' matches your 'Role' type
    // If 'role_id' is a UUID and you fetch 'role(name)' from another table, adjust this.
    // Assuming 'role' is a direct column that stores 'manager', 'caisse', etc.
    return {
      id: userData.id,
      auth_user_id: authUser.id, // Include auth_user_id if necessary for server-side
      nom: userData.nom,
      email: userData.email,
      role: userData.role as Role, // Cast to Role type
      date_creation: userData.date_creation,
    };
  } catch (error) {
    console.error('Server-side Token verification error in lib/auth.ts:', error);
    throw error;
  }
}

export async function refreshSessionServer(refreshToken: string) { // Renamed to avoid confusion
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) {
      throw new Error('Failed to refresh session');
    }
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
    };
  } catch (error) {
    console.error('Server-side Session refresh error in lib/auth.ts:', error);
    throw error;
  }
}