import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS_CODE } from '../config/http_status';
import { ITokenData } from '../interfaces/jwt';
import logging from '../config/logging';
import config from '../config/config';

declare global {
    namespace Express {
        interface Request {
            tokenData?: ITokenData;
        }
    }
}

const NAMESPACE = 'AUTH_MIDDLEWARE';

export const CheckToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (secret && token) {
        jwt.verify(token, secret, (err, jwtData) => {
            if (err) return res.status(HTTP_STATUS_CODE.Forbidden).json({ message: 'Invalid token' });
            const data = jwtData as ITokenData;
            req.tokenData = data;
            next();
        });
    } else {
        next();
    }
};

export const AuthernticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    if (token == null) return res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Unauthorized access, token not found' });

    const secret = config.auth.access_token_secret;
    if (secret) {
        jwt.verify(token, secret, (err, jwtData) => {
            if (err) return res.status(HTTP_STATUS_CODE.Forbidden).json({ message: 'Invalid token' });
            const data = jwtData as ITokenData;
            req.tokenData = data;
            next();
        });
    } else {
        res.status(HTTP_STATUS_CODE.InternaleServerError).json({ message: 'An unexpected error occured!' });
    }
};
