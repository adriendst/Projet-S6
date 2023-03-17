import { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import StatusCode from '../config/statusCodes';

export const ValidateJoi = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        schema
            .validateAsync(req.body)
            .then((body) => {
                req.body = body;
                next();
            })
            .catch((error) => res.status(StatusCode.UnprocessableEntity).json({ error }));
    };
};

export const ValidateQueryJoi = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        schema
            .validateAsync(req.query)
            .then((query) => {
                req.query = query;
                next();
            })
            .catch((error) => res.status(StatusCode.UnprocessableEntity).json({ error }));
    };
};
