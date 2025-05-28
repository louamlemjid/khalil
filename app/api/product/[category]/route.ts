import { NextRequest,NextResponse } from "next/server";
import { ProductService } from "@/app/service/productService";
import { useParams } from "next/navigation";

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest, { params }: { params: { category: string } }) {
    const { category } = params;

    try {
        const products = await ProductService.getProductsByCategory(category);
        console.log(`Fetched products for category ${category}:`, products);
        
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}