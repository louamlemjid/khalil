import { NextResponse,NextRequest } from "next/server";
import { ProductService } from "@/app/service/productService";

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest) {
    try {
        const products = await ProductService.getAllProducts();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();

        const createdProduct = await ProductService.createProduct(requestBody);
        console.log('Product created successfully:', createdProduct);

        return NextResponse.json(createdProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}