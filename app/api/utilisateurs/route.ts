import { NextRequest,NextResponse } from "next/server";
import { UtilisateurService } from "@/app/service/utilisateurService";
export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest) {
    try {
        const utilisateurs = await UtilisateurService.getAllUtilisateurs();
        return NextResponse.json(utilisateurs, { status: 200 });
    } catch (error) {
        console.error('Error fetching utilisateurs:', error);
        return NextResponse.json({ error: 'Failed to fetch utilisateurs' }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {  
    try {
        const requestBody = await req.json();
        const createdUtilisateur = await UtilisateurService.createUtilisateur(requestBody);
        console.log('Utilisateur created successfully:', createdUtilisateur);
        return NextResponse.json(createdUtilisateur, { status: 201 });
    } catch (error) {
        console.error('Error creating utilisateur:', error);
        return NextResponse.json({ error: 'Failed to create utilisateur' }, { status: 500 });
    }
}