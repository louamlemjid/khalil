import { Request, Response } from 'next/server';
import dbConnect from '@/lib/db';
import Produit from '@/models/Produit';
import Stock from '@/models/Stock';
import { requireAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await dbConnect();
    
    const produit = await Produit.findById(id);
    
    if (!produit) {
      return Response.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Get stock information
    const stock = await Stock.findOne({ produit: id });
    
    return Response.json({
      success: true,
      data: {
        ...produit.toObject(),
        stock: stock ? { 
          quantite: stock.quantite, 
          seuilAlerte: stock.seuilAlerte 
        } : null,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json(
      { success: false, message: 'An error occurred while fetching product' },
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
    
    const { nom, description, prix, categorie, image, stock } = await req.json();
    
    if (!nom || !description || prix === undefined || !categorie) {
      return Response.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    const produit = await Produit.findByIdAndUpdate(
      id,
      { nom, description, prix, categorie, image },
      { new: true, runValidators: true }
    );
    
    if (!produit) {
      return Response.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Update or create stock entry if stock information is provided
    if (stock && typeof stock.quantite === 'number' && typeof stock.seuilAlerte === 'number') {
      await Stock.findOneAndUpdate(
        { produit: id },
        {
          quantite: stock.quantite,
          seuilAlerte: stock.seuilAlerte,
          derniereMiseAJour: new Date(),
        },
        { upsert: true, new: true }
      );
    }
    
    return Response.json({
      success: true,
      data: produit,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json(
      { success: false, message: 'An error occurred while updating product' },
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
    
    const produit = await Produit.findById(id);
    
    if (!produit) {
      return Response.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Delete associated stock
    await Stock.findOneAndDelete({ produit: id });
    
    // Delete the product
    await produit.deleteOne();
    
    return Response.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json(
      { success: false, message: 'An error occurred while deleting product' },
      { status: 500 }
    );
  }
}