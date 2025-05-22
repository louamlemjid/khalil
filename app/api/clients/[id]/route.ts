import { Request, Response } from 'next/server';
import dbConnect from '@/lib/db';
import Client from '@/models/Client';
import { requireAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await dbConnect();
    
    const client = await Client.findById(id);
    
    if (!client) {
      return Response.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return Response.json(
      { success: false, message: 'An error occurred while fetching client' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    await dbConnect();
    
    const { nom, email, telephone, adresse } = await req.json();
    
    if (!nom) {
      return Response.json(
        { success: false, message: 'Please provide client name' },
        { status: 400 }
      );
    }
    
    const client = await Client.findByIdAndUpdate(
      id,
      { nom, email, telephone, adresse },
      { new: true, runValidators: true }
    );
    
    if (!client) {
      return Response.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return Response.json(
      { success: false, message: 'An error occurred while updating client' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    await dbConnect();
    
    const client = await Client.findById(id);
    
    if (!client) {
      return Response.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }
    
    await client.deleteOne();
    
    return Response.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    return Response.json(
      { success: false, message: 'An error occurred while deleting client' },
      { status: 500 }
    );
  }
}