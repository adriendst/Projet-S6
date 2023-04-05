import express from 'express';
import { HTTP_STATUS_CODE } from '../config/http_status';
import Daos from '../daos/Daos';
import DeveloperDao from '../daos/DeveloperDao';
import { CompletionParameters } from '@steam-wiki/types';
import CompletionSchemas from '../joi/completion';
import { ValidateJoi, ValidateQueryJoi } from '../middleware/joi';

const NAMESPACE = 'DEVELOPER-ROUTE';

const router = express.Router();

const developerDao: DeveloperDao = Daos.DeveloperDao;

/**
 * @swagger
 * /v1/developer/complete:
 *   get:
 *     summary: Get autocompletions for a string
 *     tags: [Developer]
 *     parameters:
 *       - $ref: '#/components/parameters/SearchTextParameter'
 *       - $ref: '#/components/parameters/ResultsParameter'
 *     responses:
 *       200:
 *         description: Sucessfully retrived developer names
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/complete', ValidateQueryJoi(CompletionSchemas.default), (req, res) => {
    const params = req.query as unknown as CompletionParameters;

    developerDao
        .completeName(params)
        .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
        .catch((err) => res.status(err.code).json(err));
});

export = router;

/**
 * @swagger
 * tags:
 *   name: Developer
 *   description: The developer managing API endpoint
 */
