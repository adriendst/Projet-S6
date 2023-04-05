import { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../config/http_status';

export const ValidateJoi = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        schema
            .validateAsync(req.body)
            .then((body) => {
                req.body = body;
                next();
            })
            .catch((error) => res.status(HTTP_STATUS_CODE.UnprocessableEntity).json({ error }));
    };
};

export const ValidateParamsJoi = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        schema
            .validateAsync(req.params)
            .then((params) => {
                req.params = params;
                next();
            })
            .catch((error) =>
                res.status(HTTP_STATUS_CODE.UnprocessableEntity).json({
                    message: HTTP_STATUS.UnprocessableEntity.message,
                    error,
                }),
            );
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
            .catch((error) => res.status(HTTP_STATUS_CODE.UnprocessableEntity).json({ error }));
    };
};

export const ValidateAdvancedJoi = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        schema
            .validateAsync(req)
            .then((validatedReq) => {
                req = validatedReq;
                next();
            })
            .catch((error) => res.status(HTTP_STATUS_CODE.UnprocessableEntity).json({ error }));
    };
};
