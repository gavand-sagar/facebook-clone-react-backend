import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config';

const authenticate: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: 'No token provided'
    });
  }

  //Decoding the token
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as JwtPayload;
    req.user = decoded.user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
};

export default authenticate;
