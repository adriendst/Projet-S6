import express from 'express';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../config/http_status';
import config from '../config/config';
import logging from '../config/logging';
import Daos from '../daos/Daos';
import GameDao from '../daos/GameDao';
import { FilterParameters } from '../interfaces/filter';

const NAMESPACE = 'GAME-ROUTE';

const router = express.Router();

const gameDao: GameDao = Daos.GameDao;

/**
 * @swagger
 * /v1/game/{id}:
 *   get:
 *     summary: Get a single game
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 10
 *         description: The games id
 *     responses:
 *       200:
 *         description: Sucessfully retrived the game
 *       409:
 *         description: Game not found
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (id === undefined || id.length < 1) {
        res.status(HTTP_STATUS.UnprocessableEntity.code).end();
    } else {
        gameDao
            .getGameById({ id })
            .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
            .catch((err) => res.status(err.code).json(err));
    }
});

/**
 * @swagger
 * /v1/game/complete/{search}:
 *   get:
 *     summary: Get autocompletions for a string
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         example: "Counter"
 *       - $ref: '#/components/parameters/ResultsParameter'
 *     responses:
 *       200:
 *         description: Sucessfully retrived completions of game names for the given string
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/complete/:search', (req, res) => {
    const searchText = req.params.search ?? '';
    if (searchText.trim().length === 0) {
        res.status(HTTP_STATUS_CODE.UnprocessableEntity).json(HTTP_STATUS.UnprocessableEntity);
    } else {
        gameDao
            .completeName({ searchText })
            .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
            .catch((err) => res.status(err.code).json(err));
    }
});

/**
 * @swagger
 * /v1/game/filter/{page}:
 *   get:
 *     summary: Get games
 *     tags: [Game]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParameter'
 *       - $ref: '#/components/parameters/DeveloperParameter'
 *       - $ref: '#/components/parameters/PublisherParameter'
 *       - $ref: '#/components/parameters/PlatformParameter'
 *       - in: query
 *         name: and_platforms
 *         required: false
 *         schema:
 *           type: boolean
 *         default: true
 *         description: The games of the publishers to show
 *       - $ref: '#/components/parameters/CategoryParameter'
 *       - $ref: '#/components/parameters/GenreParameter'
 *       - in: query
 *         name: required_age
 *         required: false
 *         schema:
 *           type: integer
 *         example: 18
 *         description: The games of the publishers to show
 *       - in: query
 *         name: order_by
 *         required: false
 *         schema:
 *           type: string
 *         example: name
 *         description: The field to order the games by
 *       - $ref: '#/components/parameters/OrderTypeParameter'
 *     responses:
 *       200:
 *         description: Sucessfully retrived games
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/filter/:page', (req, res) => {
    // pattern: “[^,]+”
    const page = parseInt(req.params.page) ?? 1;
    const filters = req.query as FilterParameters;
    gameDao
        .filterGames(page, filters)
        .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
        .catch((err) => res.status(err.code).json(err));
});

export = router;

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: The game managing API
 */
