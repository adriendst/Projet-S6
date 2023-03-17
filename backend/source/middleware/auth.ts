import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import StatusCode from '../config/statusCodes';
import { ITokenData } from '../interfaces/jwt';

declare global {
    namespace Express {
        interface Request {
            callerId: number;
        }
    }
}

export const authernticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    if (token == null) return res.status(StatusCode.Unauthorized).json({ message: 'Unauthorized access' });

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (secret) {
        jwt.verify(token, secret, (err, jwtData) => {
            if (err) return res.status(StatusCode.Forbidden).json({ message: 'Invalid token' });
            const data = jwtData as ITokenData;
            req.callerId = data.userId;
            next();
        });
    } else {
        res.status(StatusCode.InternaleServerError).json({ message: 'An unexpected error occured!' });
    }
};
