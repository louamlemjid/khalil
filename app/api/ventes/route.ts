import { NextRequest, NextResponse } from 'next/server';
import { VenteService } from '@/app/service/venteService';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest) {
    try {
        const ventes = await VenteService.getAllVentes();
        return NextResponse.json(ventes, { status: 200 });
    } catch (error) {
        console.error('Error fetching ventes:', error);
        return NextResponse.json({ error: 'Failed to fetch ventes' }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();

        const createdVente = await VenteService.createVente(requestBody);
        console.log('Vente created successfully:', createdVente);

        return NextResponse.json(createdVente, { status: 201 });
    } catch (error) {
        console.error('Error creating vente:', error);
        return NextResponse.json({ error: 'Failed to create vente' }, { status: 500 });
    }
}