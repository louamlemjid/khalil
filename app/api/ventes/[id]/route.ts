import {NextRequest,NextResponse} from "next/server";
import { VenteService } from "@/app/service/venteService";
import { useParams } from "next/navigation";
export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const vente = await VenteService.getVenteById(id);
        if (!vente) {
            return NextResponse.json({ error: 'Vente not found' }, { status: 404 });
        }
        return NextResponse.json(vente, { status: 200 });
    } catch (error) {
        console.error(`Error fetching vente with ID ${id}:`, error);
        return NextResponse.json({ error: 'Failed to fetch vente' }, { status: 500 });
    }
}
