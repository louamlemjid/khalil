import {NextRequest,NextResponse} from "next/server";
import {UtilisateurService} from "@/app/service/utilisateurService";
import {useParams} from "next/navigation";

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const utilisateur = await UtilisateurService.getUtilisateurById(id);
        if (!utilisateur) {
            return NextResponse.json({ error: 'Utilisateur not found' }, { status: 404 });
        }
        return NextResponse.json(utilisateur, { status: 200 });
    } catch (error) {
        console.error(`Error fetching utilisateur with id ${id}:`, error);
        return NextResponse.json({ error: 'Failed to fetch utilisateur' }, { status: 500 });
    }
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const requestBody = await req.json();
        const updatedUtilisateur = await UtilisateurService.updateUtilisateur(id, requestBody);
        if (!updatedUtilisateur) {
            return NextResponse.json({ error: 'Utilisateur not found' }, { status: 404 });
        }
        return NextResponse.json(updatedUtilisateur, { status: 200 });
    } catch (error) {
        console.error(`Error updating utilisateur with id ${id}:`, error);
        return NextResponse.json({ error: 'Failed to update utilisateur' }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const deletedUtilisateur = await UtilisateurService.deleteUtilisateur(id);
        
        return NextResponse.json({ message: deletedUtilisateur }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting utilisateur with id ${id}:`, error);
        return NextResponse.json({ error: 'Failed to delete utilisateur' }, { status: 500 });
    }
}