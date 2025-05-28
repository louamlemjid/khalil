// src/lib/types.ts

export type Role = 'manager' | 'caisse' | 'stock_manager';

export interface Utilisateur {
  id: string;
  auth_user_id?: string; // Optional if not always needed on frontend
  nom: string;
  role: Role;
  date_creation: string;
  email: string;
}

export interface User { // This can be removed or used as a more generic user type if needed
  id: string;
  auth_user_id: string;
  nom: string;
  role: Role;
  date_creation: string;
}

export interface Client {
  id: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  date_creation: string;
}

export interface Product {
  id: string;
  nom: string;
  description: string;
  prix: number;
  categorie: string;
  image: string | null;
  date_creation: string;
}

export interface Stock {
  id: string;
  produit_id: string;
  quantite: number;
  seuil_alerte: number;
  derniere_mise_a_jour: string;
  produit?: Product;
}

export interface Vente {
  id: string;
  client_id: string;
  utilisateur_id: string;
  date: string;
  remise: number;
  total: number;
  status : 'pending' | 'completed' | 'cancelled';
  paiment_id: string;
}

export interface Paiment {
  id: string;
  vente_id: string;
  montant: number;
  mantant_client: number;
  type: 'cash' | 'card' | 'mobile_money';
  date: string;
  status: 'pending' | 'completed' | 'failed';
  
}

export type ProductCategory = 'coffee' | 'jus' | 'pizzas' | 'pastries' | 'sandwiches' | 'desserts' | 'drinks' | 'snacks';