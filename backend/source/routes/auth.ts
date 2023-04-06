import express from 'express';
import jwt from 'jsonwebtoken';
import AuthDao from '../daos/AuthDao';
import { ValidateJoi } from '../middleware/joi';
import logging from '../config/logging';
import config from '../config/config';
import Daos from '../daos/Daos';
import UserSchemas from '../joi-schemas/user';
import { LoginRequestBody, DBRefreshToken, JWTToken, JWTTokenData } from '@steam-wiki/types';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../config/http_status';
import bcrypt from 'bcrypt';
import UserDao from '../daos/UserDao';
import { APIError } from '../error/ApiError';
const NAMESPACE = 'AUTH-ROUTE';

const router = express.Router();

const authDao: AuthDao = Daos.AuthDao;
const userDao: UserDao = Daos.UserDao;

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login as a user
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: The parameters required for a user to login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequestBody'
 *     responses:
 *       200:
 *         description: Sucessfully logged in
 *       401:
 *         description: Invalid login information
 *       422:
 *         description: The body does not correspond to the required body schema
 */
router.post('/login', ValidateJoi(UserSchemas.login), async (req, res) => {
    try {
        const { email, password } = req.body as LoginRequestBody;
        const userAgent = req.headers['user-agent']!;
        const user = await authDao.findByEmail(email);
        if (!user) {
            return res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Invalid credentials' });
        }

        const userId = user.id;
        const accessToken = generateAccessToken({ userId });
        const refreshToken = generateRefreshToken(userId, userAgent);

        //Enregistrement du jeton de rafraîchissement en base de données
        await userDao.insertToken({ userId, token: refreshToken, userAgent: userAgent });

        // Renvoi du jeton d'accès et du jeton de rafraîchissement au client
        res.status(HTTP_STATUS_CODE.Ok).json({
            accessToken,
            refreshToken,
            expires_in: config.auth.access_token_expiration,
            user: { email: user.email, games: user.games },
        });
    } catch (error) {
        logging.error(NAMESPACE, 'login', error);
        res.status(HTTP_STATUS_CODE.InternaleServerError).json({ message: HTTP_STATUS.InternaleServerError });
    }
});

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     summary: Logout as a user
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: The parameters required for the logout of a user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequestBody'
 *     responses:
 *       204:
 *         description: Sucessfully logged out
 *       401:
 *         description: Invalid login information
 *       422:
 *         description: The body does not correspond to the required body schema
 */
router.post('/logout', ValidateJoi(UserSchemas.logout), async (req, res) => {
    try {
        const { refreshToken } = req.body as JWTToken;
        const userAgent = req.headers['user-agent']!;

        const tokenData = await getTokenData(refreshToken);
        const userId = tokenData.userId;
        const user = await userDao.getById(userId);
        const dbTokens = (user.refresh_tokens ?? []) as Array<DBRefreshToken>;
        const dbToken = dbTokens.find((value) => value.token === refreshToken);

        if (dbToken === undefined) {
            return res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Invalid refresh token' });
        }

        await userDao.deleteToken({ userId, token: refreshToken, userAgent });

        res.status(HTTP_STATUS_CODE.NoContent).end();
    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.code).json({ cause: error.cause });
            return;
        }
        logging.error(NAMESPACE, 'refresh', error);
        res.status(HTTP_STATUS_CODE.InternaleServerError).json({ ...HTTP_STATUS.InternaleServerError, cause: error });
    }
});

const getTokenData = (token: string) => {
    return new Promise<JWTTokenData>((resolve, reject) => {
        jwt.verify(token, config.auth.refresh_token_secret, (err, jwtData) => {
            if (err) return reject(APIError.withStatus(HTTP_STATUS.Forbidden, `Invalid token: The token < ${token} > could no be verified`));
            const data = jwtData as JWTTokenData;
            resolve({ userId: data.userId });
        });
    });
};

const generateAccessToken = (data: JWTTokenData) => {
    return jwt.sign(data, config.auth.access_token_secret, { expiresIn: config.auth.access_token_expiration + 'min' });
};

const generateRefreshToken = (userId: string, userAgent: string | undefined) => {
    return jwt.sign({ userId, userAgent }, config.auth.refresh_token_secret);
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
 *     LoginRequestBody:
 *       allOf:
 *         - $ref: '#/components/schemas/UserData'
 *
 *     LoginResponseBody:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The access token of the user
 *         refreshToken:
 *           type: string
 *           description: The refresh token of the user
 *         expires_in:
 *           type: integer
 *           description: The number of minutes until the access-token expires
 *         user:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: The users email-adress
 *             games:
 *               type: array
 *               items:
 *                 type: number
 *               description: The ids of the games that are in the users libraray
 *       example:
 *         refreshToken: <refresh-token>
 *         accessToken: <access-token>
 *         expires_in: 30
 *         user:
 *           email: user@steamwiki.com
 *           games: [10, 20]
 *
 *     RegisterRequestBody:
 *       allOf:
 *         - $ref: '#/components/schemas/UserData'
 *
 *     UserData:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         email: "user@steamwiki.com"
 *         password: "password123!"
 *
 *     LogoutRequestBody:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The refresh token of the user
 *       example:
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR"
 */
