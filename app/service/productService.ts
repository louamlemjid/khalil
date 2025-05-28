import { Product } from "@/lib/types";
import {supabase} from "@/lib/db";

export class ProductService {
    static async createProduct(product: Partial<Product>): Promise<Product> {
        try {
            const { data, error } = await supabase
                .from('produit')
                .insert([product])
                .select('*')
                .single();

            if (error) {
                console.error('Error creating product:', error);
                throw new Error('Failed to create product');
            }

            return data as Product;
        } catch (error) {
            console.error('Error in createProduct:', error);
            throw error;
        }
    }
    async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
        try {
            const { data, error } = await supabase
                .from('produit')
                .update(product)
                .eq('id', id)
                .select('*')
                .single();

            if (error) {
                console.error('Error updating product:', error);
                throw new Error('Failed to update product');
            }

            return data as Product | null;
        } catch (error) {
            console.error('Error in updateProduct:', error);
            throw error;
        }
    }
    async deleteProduct(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('produit')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting product:', error);
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error in deleteProduct:', error);
            throw error;
        }
    }

    static async getProductsByCategory(category: string): Promise<Product[]> {
        try {
        const { data, error } = await supabase
            .from('produit')
            .select('*')
            .eq('categorie', category);
    
        if (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products');
        }
    
        return data as Product[];
        } catch (error) {
        console.error('Error in getProductsByCategory:', error);
        throw error;
        }
    }

    static async getAllCategories(): Promise<string[]> {
        try {
            const { data, error } = await supabase
                .from('produit')
                .select('categorie');
            
            if (error) {
                console.error('Error fetching categories:', error);
                throw new Error('Failed to fetch categories');
            }

            return data.map(item => item.categorie) as string[];
        } catch (error) {
            console.error('Error in getAllCategories:', error);
            throw error;
        }
    }
    static async getAllProducts(): Promise<Product[]> {
        try {
            const { data, error } = await supabase
                .from('produit')
                .select('*');

            if (error) {
                console.error('Error fetching all products:', error);
                throw new Error('Failed to fetch all products');
            }

            return data as Product[];
        } catch (error) {
            console.error('Error in getAllProducts:', error);
            throw error;
        }
    }

    static async getProductById(id: string): Promise<Product | null> {
        try {
            const { data, error } = await supabase
                .from('produit')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching product by ID:', error);
                throw new Error('Failed to fetch product');
            }

            return data as Product | null;
        } catch (error) {
            console.error('Error in getProductById:', error);
            throw error;
        }
    }
}