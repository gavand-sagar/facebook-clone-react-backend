import { Schema, model } from 'mongoose';
import { IUser } from '../@types/models/user.model';
import UserMethods, { preSaveUser } from './methods/user.method';
import UserValidation from './validations/user.validation';

export const UserSchema = new Schema<IUser>(
  {
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (avatar: string) => {
          // @ts-ignore
          if (UserSchema.methods.skipValidation()) return true;
          return UserValidation.avatar(avatar);
        },
        message: 'File extension not allowed (only png, jpg, jpeg, gif)'
      }
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: (name: string) => {
          // @ts-ignore
          if (UserSchema.methods.skipValidation()) return true;
          return UserValidation.name(name);
        },
        message: 'Name must be only letters and spaces'
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email: string) => {
          // @ts-ignore
          if (UserSchema.methods.skipValidation()) return true;
          return UserValidation.email(email);
        },
        message: 'Email is not valid'
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (password: string) => {
          // @ts-ignore
          if (UserSchema.methods.skipValidation()) return true;
          return UserValidation.password(password);
        },
        message:
          'Password must be at least 8 characters long, contain at least one number, one uppercase letter and one special character (@$!%*?&)'
      }
    }
  },
  {
    timestamps: true,
    methods: UserMethods
  }
);

UserSchema.pre('save', preSaveUser);

/**
 * Validations
 */

export const User = model('User', UserSchema);
