import express from 'express';
import { HTTP_STATUS_CODE } from '../config/http_status';
import Daos from '../daos/Daos';
import { CompletionParameters } from '@steam-wiki/types';
import CompletionSchemas from '../joi/completion';
import { ValidateQueryJoi } from '../middleware/joi';
import PublisherDao from '../daos/PublisherDao';

const NAMESPACE = 'DEVELOPER-ROUTE';

const router = express.Router();

const publisherDao: PublisherDao = Daos.PublisherDao;

/**
 * @swagger
 * /v1/publisher/complete:
 *   get:
 *     summary: Get autocompletions for a string
 *     tags: [Publisher]
 *     parameters:
 *       - $ref: '#/components/parameters/SearchTextParameter'
 *       - $ref: '#/components/parameters/ResultsParameter'
 *     responses:
 *       200:
 *         description: Sucessfully retrived publishers names
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/complete', ValidateQueryJoi(CompletionSchemas.default), (req, res) => {
    const params = req.query as unknown as CompletionParameters;

    publisherDao
        .completeName(params)
        .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
        .catch((err) => res.status(err.code).json(err));
});

export = router;

/**
 * @swagger
 * tags:
 *   name: Publisher
 *   description: The publisher managing API endpoint
 */
