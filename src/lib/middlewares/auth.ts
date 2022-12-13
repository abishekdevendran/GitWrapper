// Middleware to check if session exists
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth Checking');
  if (!req.session.accessToken) {
    res.send('No session found');
    return;
  }
  console.log('access token: ', req.session.accessToken);
  next();
};

export default auth;
