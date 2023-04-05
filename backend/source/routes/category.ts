import express from 'express';
import { HTTP_STATUS_CODE } from '../config/http_status';
import Daos from '../daos/Daos';
import CategoryDao from '../daos/CategoryDao';

const NAMESPACE = 'CATEGORY_ROUTE';

const router = express.Router();

const categoryDao: CategoryDao = Daos.CategoryDao;

/**
 * @swagger
 * /v1/category/all:
 *   get:
 *     summary: Get all the categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Sucessfully retrived all categories
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/all', (_, res) => {
    categoryDao
        .getAll()
        .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
        .catch((err) => res.status(err.code).json(err));
});

export = router;

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: The category managing API endpoint
 */
