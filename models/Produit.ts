import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IProduit extends Document {
  nom: string;
  description: string;
  prix: number;
  categorie: string;
  image?: string;
  dateCreation: Date;
}

const ProduitSchema = new Schema<IProduit>({
  nom: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  prix: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative'],
  },
  categorie: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  image: {
    type: String,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

const Produit = models.Produit || model<IProduit>('Produit', ProduitSchema);

export default Produit;