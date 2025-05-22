import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IPaiement extends Document {
  vente: mongoose.Types.ObjectId;
  montant: number;
  montantClient: number;
  type: 'espèces' | 'carte' | 'virement' | 'chèque';
  date: Date;
  statut: 'en attente' | 'complété' | 'annulé';
}

const PaiementSchema = new Schema<IPaiement>({
  vente: {
    type: Schema.Types.ObjectId,
    ref: 'Vente',
    required: true,
  },
  montant: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount cannot be negative'],
  },
  montantClient: {
    type: Number,
    required: [true, 'Please provide a client amount'],
    min: [0, 'Client amount cannot be negative'],
  },
  type: {
    type: String,
    enum: ['espèces', 'carte', 'virement', 'chèque'],
    required: [true, 'Please provide a payment type'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  statut: {
    type: String,
    enum: ['en attente', 'complété', 'annulé'],
    default: 'en attente',
  },
});

const Paiement = models.Paiement || model<IPaiement>('Paiement', PaiementSchema);

export default Paiement;