import {supabase} from '@/lib/db'
import { Paiment } from '@/lib/types';

export class PaimentService {
    static async createPaiment(paiment: Partial<Paiment>): Promise<Paiment> {
        try {
            const { data, error } = await supabase
                .from('paiment')
                .insert([paiment])
                .select('*')
                .single();

            if (error) {
                console.error('Error creating paiment:', error);
                throw new Error('Failed to create paiment');
            }

            return data as Paiment;
        } catch (error) {
            console.error('Error in createPaiment:', error);
            throw error;
        }
    }

    static async getAllPaiments(): Promise<Paiment[]> {
        try {
            const { data, error } = await supabase
                .from('paiment')
                .select('*');

            if (error) {
                console.error('Error fetching paiments:', error);
                throw new Error('Failed to fetch paiments');
            }

            return data as Paiment[];
        } catch (error) {
            console.error('Error in getAllPaiments:', error);
            throw error;
        }
    }
}