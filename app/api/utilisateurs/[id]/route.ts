import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Utilisateur from '@/models/Utilisateur';
import Role from '@/models/Role';
import { requireAuth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return;
    
    const { id } = params;
    
    await dbConnect();
    
    const utilisateur = await Utilisateur.findById(id).populate('role', 'nom');
    
    if (!utilisateur) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: utilisateur,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return;
    
    const { id } = params;
    
    await dbConnect();
    
    const { nom, email, roleId } = await req.json();
    
    if (!nom || !email || !roleId) {
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
    
    // Check if user exists
    const utilisateur = await Utilisateur.findById(id);
    if (!utilisateur) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if email is already in use by another user
    const existingUser = await Utilisateur.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    utilisateur.nom = nom;
    utilisateur.email = email;
    utilisateur.role = roleId;
    
    await utilisateur.save();
    
    return NextResponse.json({
      success: true,
      data: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: role.nom,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return;
    
    const { id } = params;
    
    await dbConnect();
    
    const utilisateur = await Utilisateur.findById(id);
    
    if (!utilisateur) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    await utilisateur.deleteOne();
    
    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting user' },
      { status: 500 }
    );
  }
}