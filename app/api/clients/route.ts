import { Request, Response } from 'next/server';
import dbConnect from '@/lib/db';
import Client from '@/models/Client';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const clients = await Client.find({});
    
    return Response.json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return Response.json(
      { success: false, message: 'An error occurred while fetching clients' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { nom, email, telephone, adresse } = await req.json();
    
    if (!nom) {
      return Response.json(
        { success: false, message: 'Please provide client name' },
        { status: 400 }
      );
    }
    
    const client = await Client.create({
      nom,
      email,
      telephone,
      adresse,
    });
    
    return Response.json({
      success: true,
      data: client,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return Response.json(
      { success: false, message: 'An error occurred while creating client' },
      { status: 500 }
    );
  }
}