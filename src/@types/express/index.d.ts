export default {};
import express from 'express';
import { DecodedUser } from '../token';

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
      params?: {
        id: number;
        commentId: number;
      };
    }
  }
}
