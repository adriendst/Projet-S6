import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODE } from '../config/http_status';
import config from '../config/config';
import * as semver from 'semver';

// Used library https://www.npmjs.com/package/semver for version comparison

export const ValidateTypesVersion = (req: Request, res: Response, next: NextFunction) => {
    if (
        typeof req.headers['x-used-types-version'] !== 'string' ||
        !semver.valid(req.headers['x-used-types-version']) ||
        !semver.satisfies(req.headers['x-used-types-version'], config.types.min_version.string)
    ) {
        res.status(HTTP_STATUS_CODE.BadRequest).json({
            error: 'The used version of types is not compatibale with the version of the server! Please update you types package!',
            package: '@steam-wiki/types',
            min_version: config.types.min_version.string,
            used_version: config.types.used_version,
        });
        return;
    }

    next();
};
