// Middleware to remove all fields in response that contain "https://api.github.com”
import { Request, Response, NextFunction, response } from 'express';

declare module 'express' {
  export interface Response {
    body?: any; // adding our custom declaration. THis could have been a better type.
  }
}

const cleanResponse = (req: Request, res: Response, next: NextFunction) => {
  // override the express response send method
  const _send = res.send;
  res.send = function (body): any {
    if (body) {
      if (typeof body === 'object') {
        let stringBody = JSON.stringify(body);
        
      }
    }
    _send.call(this, body);
  };
  next();
};

export default cleanResponse;
