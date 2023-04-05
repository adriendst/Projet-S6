import express from 'express';
import jwt from 'jsonwebtoken';
import AuthDao from '../daos/AuthDao';
import { ValidateJoi } from '../middleware/joi';
import { ITokenData } from '../interfaces/jwt';
import { HTTP_STATUS_CODE, HTTP_STATUS } from '../config/http_status';
import config from '../config/config';
import Daos from '../daos/Daos';
import UserSchemas from '../schemas/User';
import logging from '../config/logging';
const NAMESPACE = 'REFRESH-ROUTE';
const router = express.Router();

const authDao: AuthDao = Daos.AuthDao;

/**
 * @swagger
 * /v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: The refresh token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequestBody'
 *     responses:
 *       200:
 *         description: Sucessfully refreshed access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessTokenResponse'
 *       401:
 *         description: Invalid refresh token
 *       422:
 *         description: The body does not correspond to the required body schema
 */
router.post('/refresh', ValidateJoi(UserSchemas.refresh), async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const userAgent = req.headers['user-agent']!;
        const tokenData = await getTokenData(refreshToken);

        const userId = tokenData.userId;

        // Vérifie que le jeton de rafraîchissement existe en base de données
        const storedToken = await authDao.findToken({ userId: userId, token: refreshToken, userAgent: userAgent });
        if (!storedToken) {
            return res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Invalid refresh token' });
        }

        // Génère un nouveau jeton d'accès
        const accessToken = generateAccessToken({ userId });

        // Renvoie le nouveau jeton d'accès au client
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        logging.error(NAMESPACE, 'refresh', error);
        res.status(HTTP_STATUS_CODE.InternaleServerError).json({ message: HTTP_STATUS.InternaleServerError });
    }
});

const getTokenData = (token: string) => {
    return new Promise<ITokenData>((resolve, reject) => {
        jwt.verify(token, config.auth.refresh_token_secret, (err, jwtData) => {
            if (err) return reject({ message: 'Invalid token' });
            const data = jwtData as ITokenData;
            resolve({ userId: data.userId });
        });
    });
};

const generateAccessToken = (data: ITokenData) => {
    return jwt.sign(data, config.auth.access_token_secret, { expiresIn: config.auth.access_token_expiration + 'min' });
};

export = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 *
 * components:
 *   schemas:
 *     RefreshTokenRequestBody:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The refresh token of the user
 *       example:
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR"
 * */
