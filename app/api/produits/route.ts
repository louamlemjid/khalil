import { Request, Response } from 'next/server';
import dbConnect from '@/lib/db';
import Produit from '@/models/Produit';
import Stock from '@/models/Stock';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const produits = await Produit.find({});
    
    // Get stock information for each product
    const produitsWithStock = await Promise.all(
      produits.map(async (produit) => {
        const stock = await Stock.findOne({ produit: produit._id });
        return {
          ...produit.toObject(),
          stock: stock ? { 
            quantite: stock.quantite, 
            seuilAlerte: stock.seuilAlerte 
          } : null,
        };
      })
    );
    
    return Response.json({
      success: true,
      count: produits.length,
      data: produitsWithStock,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json(
      { success: false, message: 'An error occurred while fetching products' },
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
    
    const { nom, description, prix, categorie, image, stock } = await req.json();
    
    if (!nom || !description || prix === undefined || !categorie) {
      return Response.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    const produit = await Produit.create({
      nom,
      description,
      prix,
      categorie,
      image,
    });
    
    // Create stock entry if stock information is provided
    if (stock && typeof stock.quantite === 'number' && typeof stock.seuilAlerte === 'number') {
      await Stock.create({
        produit: produit._id,
        quantite: stock.quantite,
        seuilAlerte: stock.seuilAlerte,
      });
    }
    
    return Response.json({
      success: true,
      data: produit,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json(
      { success: false, message: 'An error occurred while creating product' },
      { status: 500 }
    );
  }
}