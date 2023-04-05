import express from 'express';
import { HTTP_STATUS_CODE } from '../config/http_status';
import Daos from '../daos/Daos';
import GameDao from '../daos/GameDao';
import { CompletionParameters, FilterParameters } from '@steam-wiki/types';
import { ValidateParamsJoi, ValidateQueryJoi } from '../middleware/joi';
import CompletionSchemas from '../joi/completion';
import QuerySchemas from '../joi/query';
import FilterSchemas from '../schemas/Filter';

const NAMESPACE = 'GAME-ROUTE';

const router = express.Router();

const gameDao: GameDao = Daos.GameDao;

/**
 * @swagger
 * /v1/game/complete:
 *   get:
 *     summary: Get autocompletions for a string
 *     tags: [Game]
 *     parameters:
 *       - $ref: '#/components/parameters/SearchTextParameter'
 *       - $ref: '#/components/parameters/ResultsParameter'
 *     responses:
 *       200:
 *         description: Sucessfully retrived completions of game names for the given string
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/complete', ValidateQueryJoi(CompletionSchemas.default), (req, res) => {
    const query = req.query as unknown as CompletionParameters;

    gameDao
        .completeName(query)
        .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
        .catch((err) => res.status(err.code).json(err));
});

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
 *         description: The id of the game to get the data of
 *     responses:
 *       200:
 *         description: Sucessfully retrived the game
 *       404:
 *         description: Game not found
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/:id', ValidateParamsJoi(QuerySchemas.numberId), (req, res) => {
    const params = req.params as unknown as { id: number };

    gameDao
        .getGameById(params)
        .then((data) => res.status(HTTP_STATUS_CODE.Ok).json(data))
        .catch((err) => res.status(err.code).json(err));
});

/**
 * @swagger
 * /v1/game/filter/{page}:
 *   get:
 *     summary: Get games
 *     tags: [Game]
 *     parameters:
 *       - $ref: '#/components/parameters/TypesVersionHeader'
 *       - $ref: '#/components/parameters/PageParameter'
 *       - $ref: '#/components/parameters/NameParameter'
 *       - $ref: '#/components/parameters/DeveloperParameter'
 *       - $ref: '#/components/parameters/PublisherParameter'
 *       - $ref: '#/components/parameters/PlatformParameter'
 *       - $ref: '#/components/parameters/PlatformOperatorParameter'
 *       - $ref: '#/components/parameters/CategoryParameter'
 *       - $ref: '#/components/parameters/GenreParameter'
 *       - $ref: '#/components/parameters/RequiredAgeParamter'
 *       - $ref: '#/components/parameters/StartDateParameter'
 *       - $ref: '#/components/parameters/EndDateParameter'
 *       - $ref: '#/components/parameters/OrderByParamter'
 *       - $ref: '#/components/parameters/OrderTypeParameter'
 *     responses:
 *       200:
 *         description: Sucessfully retrived games
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/filter/:page', ValidateQueryJoi(FilterSchemas.gameFilter), (req, res) => {
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
