import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IClient extends Document {
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  dateCreation: Date;
}

const ClientSchema = new Schema<IClient>({
  nom: {
    type: String,
    required: [true, 'Please provide a client name'],
    trim: true,
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  telephone: {
    type: String,
  },
  adresse: {
    type: String,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

const Client = models.Client || model<IClient>('Client', ClientSchema);

export default Client;