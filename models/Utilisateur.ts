import mongoose, { Schema, models, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type Utilisateur = {
  id: string;
  nom: string;
  email: string;
  role: string;
  date_creation: Date;
}

export interface IUtilisateur extends Document {
  nom: string;
  email: string;
  motDePasse: string;
  role: mongoose.Types.ObjectId;
  dateCreation: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UtilisateurSchema = new Schema<IUtilisateur>({
  nom: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  motDePasse: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UtilisateurSchema.pre('save', async function () {
  if (!this.isModified('motDePasse')) return;
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// Compare password method
UtilisateurSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.motDePasse);
};

const Utilisateur = models.Utilisateur || model<IUtilisateur>('Utilisateur', UtilisateurSchema);

export default Utilisateur;