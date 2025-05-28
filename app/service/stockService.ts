import {supabase} from '@/lib/db';
import { Stock } from '@/lib/types';

export class StockService {
    static async getAllStocks(): Promise<Stock[]> {
        try {
            const { data, error } = await supabase
                .from('stock')
                .select('*');

            if (error) {
                console.error('Error fetching stocks:', error);
                throw new Error('Failed to fetch stocks');
            }

            return data as Stock[];
        } catch (error) {
            console.error('Error in getAllStocks:', error);
            throw error;
        }
    }

    static async createStock(stock: Partial<Stock>): Promise<Stock> {
        try {
            const { data, error } = await supabase
                .from('stock')
                .insert([stock])
                .select('*')
                .single();

            if (error) {
                console.error('Error creating stock:', error);
                throw new Error('Failed to create stock');
            }

            return data as Stock;
        } catch (error) {
            console.error('Error in createStock:', error);
            throw error;
        }
    }
    static async updateStock(id: string, stock: Partial<Stock>): Promise<Stock | null> {
        try {
            const { data, error } = await supabase
                .from('stock')
                .update(stock)
                .eq('id', id)
                .select('*')
                .single();

            if (error) {
                console.error('Error updating stock:', error);
                throw new Error('Failed to update stock');
            }

            return data as Stock | null;
        } catch (error) {
            console.error('Error in updateStock:', error);
            throw error;
        }
    }
    static async deleteStock(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('stock')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting stock:', error);
                throw new Error('Failed to delete stock');
            }
        } catch (error) {
            console.error('Error in deleteStock:', error);
            throw error;
        }
    }
    static async getStockByProductId(productId: string): Promise<Stock | null> {
        try {
            const { data, error } = await supabase
                .from('stock')
                .select('*')
                .eq('product_id', productId)
                .single();

            if (error) {
                console.error(`Error fetching stock for product ${productId}:`, error);
                throw new Error('Failed to fetch stock');
            }

            return data as Stock | null;
        } catch (error) {
            console.error(`Error in getStockByProductId for product ${productId}:`, error);
            throw error;
        }
    }
}