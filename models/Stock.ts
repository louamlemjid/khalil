import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IStock extends Document {
  produit: mongoose.Types.ObjectId;
  quantite: number;
  seuilAlerte: number;
  derniereMiseAJour: Date;
}

const StockSchema = new Schema<IStock>({
  produit: {
    type: Schema.Types.ObjectId,
    ref: 'Produit',
    required: true,
  },
  quantite: {
    type: Number,
    required: [true, 'Please provide a quantity'],
    min: [0, 'Quantity cannot be negative'],
  },
  seuilAlerte: {
    type: Number,
    required: [true, 'Please provide an alert threshold'],
    min: [0, 'Threshold cannot be negative'],
  },
  derniereMiseAJour: {
    type: Date,
    default: Date.now,
  },
});

const Stock = models.Stock || model<IStock>('Stock', StockSchema);

export default Stock;