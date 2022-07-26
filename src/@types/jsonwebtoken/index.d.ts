export default {};
import jwt from 'jsonwebtoken';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    user: {
      _id: string;
      name: string;
      email: string;
      avatar: string;
    };
  }
}
