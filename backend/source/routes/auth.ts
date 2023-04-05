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
import { HTTP_STATUS_CODE } from '../config/http_status'
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
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Sucessfully logged in
 *       401:
 *         description: Invalid login information
 *       422:
 *         description: The entered parameters do not correspond to the schema
 */
//router.post('/login', ValidateJoi(UserSchemas.login), async (req, res) => {
    // const body = req.body as ILogin;
    // authDao
    //     .loginUser(body)
    //     .then(async (response) => {
    //         if (response.code !== HTTP_STATUS_CODE.Ok) return res.status(response.code).json({ message: response.message });
    //         const userAgent = req.headers['user-agent'];
    //         if (!userAgent) return res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'You dont have a user-agent' });
    //         const accessToken = generateAccessToken(response.data);
    //         const refreshToken = generateRefreshToken(response.data.userId, userAgent);
    //         const insertRes = await authDao.insertToken({ userId: response.data.userId, token: refreshToken, userAgent });
    //         res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    //         res.status(response.code).json(insertRes.code < 300 ? { accessToken, refreshToken, expiration: config.auth.access_token_expiration } : { message: insertRes.message });
    //     })
    //     .catch((err) => {
    //         logging.error(NAMESPACE, err);
    //         res.status(HTTP_STATUS_CODE.InternaleServerError).json(err);
    //     });
//});

router.post('/login', ValidateJoi(UserSchemas.login), async (req, res) => {
    try {
        const { email, password } = req.body;
        const bcrypt = require('bcrypt');
        const userAgent = req.headers['user-agent']!;
        const user = await authDao.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        //const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id, userAgent);

        // Enregistrement du jeton de rafraîchissement en base de données
        await authDao.insertToken({ userId: user.id, token: refreshToken, userAgent: userAgent });

        // Renvoi du jeton d'accès et du jeton de rafraîchissement au client
        res.status(200).json({ accessToken, refreshToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
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

const generateRefreshToken = (userId: number, userAgent: string | undefined) => {
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
 *     Login:
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
