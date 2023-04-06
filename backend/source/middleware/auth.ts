import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS_CODE } from '../config/http_status';
import { JWTTokenData } from '@steam-wiki/types';
import logging from '../config/logging';
import config from '../config/config';

declare global {
    namespace Express {
        interface Request {
            tokenData?: JWTTokenData;
        }
    }
}

const NAMESPACE = 'AUTH_MIDDLEWARE';

/**
 * Will check if a token exists and if so, decode it an put its contents
 * into the req.tokenData
 */
export const CheckToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];

    const secret = config.auth.access_token_secret;
    if (secret && token) {
        console.log(token);
        jwt.verify(token, secret, (err, jwtData) => {
            if (err) return res.status(HTTP_STATUS_CODE.Forbidden).json({ message: 'Invalid token' });
            const data = jwtData as JWTTokenData;
            req.tokenData = data;
            next();
        });
    } else {
        next();
    }
};

/**
 * Will check if a token exists whcih is required, if not present, will
 * give a 401 or 403 error
 */
export const AuthernticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    if (token == null) return res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Unauthorized access, token not found' });

    const secret = config.auth.access_token_secret;
    if (secret) {
        jwt.verify(token, secret, (err, jwtData) => {
            if (err) return res.status(HTTP_STATUS_CODE.Forbidden).json({ message: 'Invalid token' });
            const data = jwtData as JWTTokenData;
            req.tokenData = data;
            next();
        });
    } else {
        res.status(HTTP_STATUS_CODE.InternaleServerError).json({ message: 'An unexpected error occured!' });
    }
};
