import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vente from '@/models/Vente';
import Stock from '@/models/Stock';
import Paiement from '@/models/Paiement';
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
    
    const vente = await Vente.findById(id)
      .populate({
        path: 'lignesVente.produit',
        select: 'nom prix',
      })
      .populate('client', 'nom')
      .populate('utilisateur', 'nom')
      .populate('paiement');
    
    if (!vente) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: vente,
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching sale' },
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
    
    const { statut } = await req.json();
    
    if (!statut || !['en cours', 'finalisée', 'annulée'].includes(statut)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid status' },
        { status: 400 }
      );
    }
    
    const vente = await Vente.findById(id);
    
    if (!vente) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }
    
    // If cancelling a sale, restore stock quantities
    if (statut === 'annulée' && vente.statut !== 'annulée') {
      await Promise.all(vente.lignesVente.map(async (ligne) => {
        const stock = await Stock.findOne({ produit: ligne.produit });
        
        if (stock) {
          stock.quantite += ligne.quantite;
          await stock.save();
        }
      }));
      
      // Cancel associated payment if any
      if (vente.paiement) {
        await Paiement.findByIdAndUpdate(vente.paiement, { statut: 'annulé' });
      }
    }
    
    vente.statut = statut;
    await vente.save();
    
    return NextResponse.json({
      success: true,
      data: vente,
    });
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating sale' },
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
    
    const vente = await Vente.findById(id);
    
    if (!vente) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }
    
    // Only allow deletion of sales in "en cours" status
    if (vente.statut !== 'en cours') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete finalized or cancelled sales' },
        { status: 400 }
      );
    }
    
    // Restore stock quantities
    await Promise.all(vente.lignesVente.map(async (ligne) => {
      const stock = await Stock.findOne({ produit: ligne.produit });
      
      if (stock) {
        stock.quantite += ligne.quantite;
        await stock.save();
      }
    }));
    
    // Delete associated payment if any
    if (vente.paiement) {
      await Paiement.findByIdAndDelete(vente.paiement);
    }
    
    await vente.deleteOne();
    
    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting sale' },
      { status: 500 }
    );
  }
}