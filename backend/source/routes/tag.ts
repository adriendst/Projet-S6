import express from 'express';
import { HTTP_STATUS_CODE } from '../config/http_status';
import Daos from '../daos/Daos';
import TagDao from '../daos/TagDao';

const NAMESPACE = 'TAG_ROUTE';

const router = express.Router();

const tagDao: TagDao = Daos.TagDao;

/**
 * @swagger
 * /v1/tag/all:
 *   get:
 *     summary: Get all the tags
 *     tags: [Tag]
 *     responses:
 *       200:
 *         description: Sucessfully retrived all tags
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/all', (_, res) => {
    tagDao
        .getAll()
        .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
        .catch((err) => res.status(err.code).json(err));
});

export = router;

/**
 * @swagger
 * tags:
 *   name: Tag
 *   description: The tag managing API endpoint
 */
