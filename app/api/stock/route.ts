import { NextRequest,NextResponse } from "next/server";
import { StockService } from "@/app/service/stockService";

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET(req: NextRequest) {
    try {
        const stocks = StockService.getAllStocks();
        return NextResponse.json(stocks, { status: 200 });
    } catch (error) {
        console.error('Error fetching product stocks:', error);
        return NextResponse.json({ error: 'Failed to fetch product stocks' }, { status: 500 });
    }
}