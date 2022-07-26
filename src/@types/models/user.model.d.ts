import { Document } from 'mongoose';

export interface IUser extends Document {
  avatar: string;
  name: string;
  email: string;
  password: string;
  skipValidation: () => boolean;
  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: boolean) => void) => void;
}
