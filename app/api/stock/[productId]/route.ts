import { StockService } from "@/app/service/stockService";
import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/app/service/productService";

import { useParams } from "next/navigation";
export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
    const { productId } = params;

    try {
        const stock = await StockService.getStockByProductId(productId);
        if (!stock) {
            return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        }
        return NextResponse.json(stock, { status: 200 });
    } catch (error) {
        console.error(`Error fetching stock for product ${productId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
    const { productId } = params;

    try {
        const requestBody = await req.json();
        const product = await ProductService.getProductById(productId);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const updatedStock = await StockService.updateStock(productId, requestBody);
        console.log('Stock updated successfully:', updatedStock);

        return NextResponse.json(updatedStock, { status: 200 });
    } catch (error) {
        console.error(`Error updating stock for product ${productId}:`, error);
        return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
    }
}