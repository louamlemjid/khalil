import {supabase} from  '@/lib/db'
import { Vente } from '@/lib/types';

export class VenteService {
    static async createVente(vente: Partial<Vente>): Promise<Vente> {
        try {
            const { data, error } = await supabase
                .from('vente')
                .insert([vente])
                .select('*')
                .single();

            if (error) {
                console.error('Error creating vente:', error);
                throw new Error('Failed to create vente');
            }

            return data as Vente;
        } catch (error) {
            console.error('Error in createVente:', error);
            throw error;
        }
    }

    static async getAllVentes(): Promise<Vente[]> {
        try {
            const { data, error } = await supabase
                .from('vente')
                .select('*');

            if (error) {
                console.error('Error fetching ventes:', error);
                throw new Error('Failed to fetch ventes');
            }

            return data as Vente[];
        } catch (error) {
            console.error('Error in getAllVentes:', error);
            throw error;
        }
    }
    static async getVenteById(id: string): Promise<Vente | null> {
        try {
            const { data, error } = await supabase
                .from('vente')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error(`Error fetching vente with ID ${id}:`, error);
                throw new Error('Failed to fetch vente');
            }

            return data as Vente | null;
            } catch (error) {
                console.error('Error in getVenteById:', error);
                return null;
            }
        }
}