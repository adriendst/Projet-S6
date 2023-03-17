import express from 'express';
import StatusCode from '../config/statusCodes';
import config from '../config/config';
import logging from '../config/logging';
import Daos from '../daos/Daos';
import GameDao from '../daos/GameDao';

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
 *         schema:
 *           type: string
 *         required: true
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
        res.status(StatusCode.UnprocessableEntity).end();
    } else {
        gameDao
            .getGameById({ id })
            .then((data) => res.status(StatusCode.Ok).json(data))
            .catch((err) => {
                res.status(err.code).json(err);
            });
    }
});

/**
 * @swagger
 * /v1/game/search/{searchtext}:
 *   get:
 *     summary: Get games
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: searchtext
 *         schema:
 *           type: string
 *         required: true
 *         description: A search-text
 *     responses:
 *       200:
 *         description: Sucessfully retrived games
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
router.get('/search/:searchtext', (req, res) => {
    const searchtext = req.params.searchtext;
    if (searchtext === undefined || searchtext.length < 1) {
        res.status(StatusCode.UnprocessableEntity).end();
    } else {
        gameDao
            .searchGamesByName({ searchtext })
            .then((data) => res.status(StatusCode.Ok).json(data))
            .catch((err) => {
                res.status(err.code).json(err);
            });
    }
});

export = router;

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: The game managing API
 *
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the game
 *         name:
 *           type: string
 *           description: The name of the game
 *       example:
 *         id: "10"
 *         name: "Counter Strike"
 */
