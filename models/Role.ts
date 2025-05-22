import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IRole extends Document {
  nom: string;
  permissions: mongoose.Types.ObjectId[];
}

const RoleSchema = new Schema<IRole>({
  nom: {
    type: String,
    required: [true, 'Please provide a role name'],
    trim: true,
    unique: true,
  },
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permission',
  }],
});

const Role = models.Role || model<IRole>('Role', RoleSchema);

export default Role;