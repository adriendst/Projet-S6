import express from 'express';
import jwt from 'jsonwebtoken';
import AuthDao from '../daos/AuthDao';
import { ValidateJoi } from '../middleware/joi';
import { IToken, ITokenData } from '../interfaces/jwt';
import { authernticateToken } from '../middleware/auth';
import logging from '../config/logging';
import config from '../config/config';
import Daos from '../daos/Daos';
import UserSchemas from '../schemas/User';
import { ILogin } from '../interfaces/auth';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../config/http_status';
import bcrypt from 'bcrypt';
const NAMESPACE = 'AUTH-ROUTE';

const router = express.Router();

const authDao: AuthDao = Daos.AuthDao;

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
        const { email, password } = req.body as ILogin;
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

        // Enregistrement du jeton de rafraîchissement en base de données
        // await authDao.insertToken({ userId, token: refreshToken, userAgent: userAgent });

        // Renvoi du jeton d'accès et du jeton de rafraîchissement au client
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        logging.error(NAMESPACE, 'login', error);
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
 */
