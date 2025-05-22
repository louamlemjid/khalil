import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vente from '@/models/Vente';
import Produit from '@/models/Produit';
import Stock from '@/models/Stock';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return;
    
    await dbConnect();
    
    const ventes = await Vente.find({})
      .populate({
        path: 'lignesVente.produit',
        select: 'nom prix',
      })
      .populate('client', 'nom')
      .populate('utilisateur', 'nom')
      .populate('paiement');
    
    return NextResponse.json({
      success: true,
      count: ventes.length,
      data: ventes,
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching sales' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return;
    
    await dbConnect();
    
    const { 
      client, 
      lignesVente, 
      remise = 0
    } = await req.json();
    
    if (!lignesVente || !Array.isArray(lignesVente) || lignesVente.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide sale items' },
        { status: 400 }
      );
    }
    
    // Calculate total and prepare line items
    const lignesPromises = lignesVente.map(async (ligne: { produit: string, quantite: number }) => {
      const produit = await Produit.findById(ligne.produit);
      
      if (!produit) {
        throw new Error(`Product with ID ${ligne.produit} not found`);
      }
      
      // Update stock
      const stock = await Stock.findOne({ produit: ligne.produit });
      
      if (!stock || stock.quantite < ligne.quantite) {
        throw new Error(`Insufficient stock for product ${produit.nom}`);
      }
      
      // Reduce stock quantity
      stock.quantite -= ligne.quantite;
      await stock.save();
      
      return {
        produit: ligne.produit,
        quantite: ligne.quantite,
        prixUnitaire: produit.prix,
        sousTotal: produit.prix * ligne.quantite,
      };
    });
    
    const processedLignes = await Promise.all(lignesPromises);
    
    // Calculate total before discount
    const sousTotal = processedLignes.reduce((total, ligne) => total + ligne.sousTotal, 0);
    
    // Apply discount
    const remiseAmount = (sousTotal * remise) / 100;
    const total = sousTotal - remiseAmount;
    
    // Create sale
    const vente = await Vente.create({
      client,
      utilisateur: auth.user._id,
      lignesVente: processedLignes,
      remise,
      total,
      statut: 'en cours',
    });
    
    return NextResponse.json({
      success: true,
      data: vente,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'An error occurred while creating sale' },
      { status: 500 }
    );
  }
}