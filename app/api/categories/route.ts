import { NextRequest,NextResponse } from "next/server";
import { ProductService } from "@/app/service/productService";

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest) {
    try {
        const categories = await ProductService.getAllCategories();
        console.log('Fetched product categories:', categories);
        
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Error fetching product categories:', error);
        return NextResponse.json({ error: 'Failed to fetch product categories' }, { status: 500 });
    }
}