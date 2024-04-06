






import jwt from 'jsonwebtoken';
import { Request,Response,NextFunction } from "express";




const SECRET = 'SECr3mm'; 

  export interface JWTPayload {
  id: string;
  email: string; 
  
}

 export const authenticateJwt = (req: Request & { user?: JWTPayload }, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, SECRET, (err, payload: any) => {
        if (err) {
          return res.sendStatus(403);
        }
        if (!payload || typeof payload === "string") {
          return res.sendStatus(403);
        }
  
     
        req.user = payload as JWTPayload;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };


 