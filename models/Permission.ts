import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IPermission extends Document {
  nom: string;
  description: string;
}

const PermissionSchema = new Schema<IPermission>({
  nom: {
    type: String,
    required: [true, 'Please provide a permission name'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
});

const Permission = models.Permission || model<IPermission>('Permission', PermissionSchema);

export default Permission;