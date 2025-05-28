import {supabase} from '@/lib/db';
import { Utilisateur } from '@/models/Utilisateur';

export class UtilisateurService {
    static async getAllUtilisateurs(): Promise<Utilisateur[]> {
        try {
            const { data, error } = await supabase
                .from('utilisateur')
                .select('*');

            if (error) {
                console.error('Error fetching utilisateurs:', error);
                throw new Error('Failed to fetch utilisateurs');
            }

            return data as Utilisateur[];
        } catch (error) {
            console.error('Error in getAllUtilisateurs:', error);
            throw error;
        }
    }

    static async createUtilisateur(utilisateur: Partial<Utilisateur>): Promise<Utilisateur> {
        try {
            const { data, error } = await supabase
                .from('utilisateur')
                .insert([utilisateur])
                .select('*')
                .single();

            if (error) {
                console.error('Error creating utilisateur:', error);
                throw new Error('Failed to create utilisateur');
            }

            return data as Utilisateur;
        } catch (error) {
            console.error('Error in createUtilisateur:', error);
            throw error;
        }
    }

    static async updateUtilisateur(id: string, utilisateur: Partial<Utilisateur>): Promise<Utilisateur | null> {
        try {
            const { data, error } = await supabase
                .from('utilisateur')
                .update(utilisateur)
                .eq('id', id)
                .select('*')
                .single();

            if (error) {
                console.error('Error updating utilisateur:', error);
                throw new Error('Failed to update utilisateur');
            }

            return data as Utilisateur | null;
        } catch (error) {
            console.error('Error in updateUtilisateur:', error);
            throw error;
        }
    }
    static async deleteUtilisateur(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('utilisateur')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting utilisateur:', error);
                throw new Error('Failed to delete utilisateur');
            }
        } catch (error) {
            console.error('Error in deleteUtilisateur:', error);
            throw error;
        }
    }
    static async getUtilisateurById(id: string): Promise<Utilisateur | null> {
        try {
            const { data, error } = await supabase
                .from('utilisateur')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching utilisateur by ID:', error);
                throw new Error('Failed to fetch utilisateur by ID');
            }

            return data as Utilisateur | null;
        } catch (error) {
            console.error('Error in getUtilisateurById:', error);
            throw error;
        }
    }
    static async getUtilisateurByEmail(email: string): Promise<Utilisateur | null> {
        try {
            const { data, error } = await supabase
                .from('utilisateur')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                console.error('Error fetching utilisateur by email:', error);
                throw new Error('Failed to fetch utilisateur by email');
            }

            return data as Utilisateur | null;
        } catch (error) {
            console.error('Error in getUtilisateurByEmail:', error);
            throw error;
        }
    }
    static async getUtilisateursByName(name: string): Promise<Utilisateur[]> {
        try {
            const { data, error } = await supabase
                .from('utilisateur')
                .select('*')
                .ilike('name', `%${name}%`);

            if (error) {
                console.error('Error fetching utilisateurs by name:', error);
                throw new Error('Failed to fetch utilisateurs by name');
            }

            return data as Utilisateur[];
        } catch (error) {
            console.error('Error in getUtilisateursByName:', error);
            throw error;
        }
    }
    static async getUtilisateursByRole(role: string): Promise<Utilisateur[]> {
        try {
            const { data, error } = await supabase
                .from('utilisateur')
                .select('*')
                .eq('role', role);

            if (error) {
                console.error('Error fetching utilisateurs by role:', error);
                throw new Error('Failed to fetch utilisateurs by role');
            }

            return data as Utilisateur[];
        } catch (error) {
            console.error('Error in getUtilisateursByRole:', error);
            throw error;
        }
    }

}
