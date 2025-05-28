import {supabase} from '@/lib/db';
import { Client } from '@/lib/types';

export class ClientService {
    static async getAllClients(): Promise<Client[]> {
        try {
            const { data, error } = await supabase
                .from('client')
                .select('*');

            if (error) {
                console.error('Error fetching clients:', error);
                throw new Error('Failed to fetch clients');
            }

            return data as Client[];
        } catch (error) {
            console.error('Error in getAllClients:', error);
            throw error;
        }
    }
   static async createClient(client: Partial<Client>): Promise<Client> {
        try {
            const { data, error } = await supabase
                .from('client')
                .insert([client])
                .select('*')
                .single();

            if (error) {
                console.error('Error creating client:', error);
                throw new Error('Failed to create client');
            }

            return data as Client;
        } catch (error) {
            console.error('Error in createClient:', error);
            throw error;
        }
    }
   static async updateClient(id: string, client: Partial<Client>): Promise<Client | null> {
        try {
            const { data, error } = await supabase
                .from('client')
                .update(client)
                .eq('id', id)
                .select('*')
                .single();

            if (error) {
                console.error('Error updating client:', error);
                throw new Error('Failed to update client');
            }

            return data as Client | null;
        } catch (error) {
            console.error('Error in updateClient:', error);
            throw error;
        }
    }
   static async deleteClient(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('client')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting client:', error);
                throw new Error('Failed to delete client');
            }
        } catch (error) {
            console.error('Error in deleteClient:', error);
            throw error;
        }
    }
   static async getClientById(id: string): Promise<Client | null> {
        try {
            const { data, error } = await supabase
                .from('client')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching client by ID:', error);
                throw new Error('Failed to fetch client');
            }

            return data as Client | null;
        } catch (error) {
            console.error('Error in getClientById:', error);
            throw error;
        }
    }
   static async getClientsByName(name: string): Promise<Client[]> {
        try {
            const { data, error } = await supabase
                .from('client')
                .select('*')
                .ilike('name', `%${name}%`);

            if (error) {
                console.error('Error fetching clients by name:', error);
                throw new Error('Failed to fetch clients');
            }

            return data as Client[];
        } catch (error) {
            console.error('Error in getClientsByName:', error);
            throw error;
        }
    }
   static async getClientsByEmail(email: string): Promise<Client[]> {
        try {
            const { data, error } = await supabase
                .from('client')
                .select('*')
                .ilike('email', `%${email}%`);

            if (error) {
                console.error('Error fetching clients by email:', error);
                throw new Error('Failed to fetch clients');
            }

            return data as Client[];
        } catch (error) {
            console.error('Error in getClientsByEmail:', error);
            throw error;
        }
    }
}