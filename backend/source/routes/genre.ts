import express from 'express';
import { HTTP_STATUS_CODE } from '../config/http_status';
import Daos from '../daos/Daos';

import GenreDao from '../daos/GenreDao';

const NAMESPACE = 'GENRE_ROUTE';

const router = express.Router();

const genreDao: GenreDao = Daos.GenreDao;

/**
 * @swagger
 * /v1/genre/all:
 *   get:
 *     summary: Get all the genres
 *     tags: [Genre]
 *     responses:
 *       200:
 *         description: Sucessfully retrived all genres
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/all', (req, res) => {
    genreDao
        .getAll()
        .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
        .catch((err) => res.status(err.code).json(err));
});

export = router;

/**
 * @swagger
 * tags:
 *   name: Genre
 *   description: The genre managing API endpoint
 */
