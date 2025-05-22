import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Utilisateur from '@/models/Utilisateur';
import Role from '@/models/Role';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return;
    
    await dbConnect();
    
    const utilisateurs = await Utilisateur.find({}).populate('role', 'nom');
    
    return NextResponse.json({
      success: true,
      count: utilisateurs.length,
      data: utilisateurs,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return;
    
    await dbConnect();
    
    const { nom, email, motDePasse, roleId } = await req.json();
    
    if (!nom || !email || !motDePasse || !roleId) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return NextResponse.json(
        { success: false, message: 'Role not found' },
        { status: 404 }
      );
    }
    
    // Check if email is already in use
    const existingUser = await Utilisateur.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    const utilisateur = await Utilisateur.create({
      nom,
      email,
      motDePasse,
      role: roleId,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: role.nom,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while creating user' },
      { status: 500 }
    );
  }
}