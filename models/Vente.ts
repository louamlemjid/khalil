import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface ILigneVente {
  produit: mongoose.Types.ObjectId;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
}

export interface IVente extends Document {
  client?: mongoose.Types.ObjectId;
  utilisateur: mongoose.Types.ObjectId;
  date: Date;
  lignesVente: ILigneVente[];
  remise: number;
  total: number;
  paiement?: mongoose.Types.ObjectId;
  statut: 'en cours' | 'finalisée' | 'annulée';
}

const LigneVenteSchema = new Schema<ILigneVente>({
  produit: {
    type: Schema.Types.ObjectId,
    ref: 'Produit',
    required: true,
  },
  quantite: {
    type: Number,
    required: [true, 'Please provide a quantity'],
    min: [1, 'Quantity must be at least 1'],
  },
  prixUnitaire: {
    type: Number,
    required: [true, 'Please provide a unit price'],
    min: [0, 'Unit price cannot be negative'],
  },
  sousTotal: {
    type: Number,
    required: [true, 'Please provide a subtotal'],
    min: [0, 'Subtotal cannot be negative'],
  },
});

const VenteSchema = new Schema<IVente>({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  utilisateur: {
    type: Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lignesVente: [LigneVenteSchema],
  remise: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
  },
  total: {
    type: Number,
    required: [true, 'Please provide a total'],
    min: [0, 'Total cannot be negative'],
  },
  paiement: {
    type: Schema.Types.ObjectId,
    ref: 'Paiement',
  },
  statut: {
    type: String,
    enum: ['en cours', 'finalisée', 'annulée'],
    default: 'en cours',
  },
});

const Vente = models.Vente || model<IVente>('Vente', VenteSchema);

export default Vente;