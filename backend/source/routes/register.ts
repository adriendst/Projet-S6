import express, { Request, Response } from 'express';
import ElasticAuthDao from '../daos/Elastic/ElasticAuthDao';
import { RegsiterData, RegisterRequestBody } from '@steam-wiki/types';
import bcrypt from 'bcrypt';
import { HTTP_STATUS_CODE } from '../config/http_status';
import { ValidateJoi } from '../middleware/joi';
import UserSchemas from '../joi-schemas/user';

const router = express.Router();

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: The request body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequestBody'
 *     responses:
 *       201:
 *         description: Sucessfully created the new user
 *       422:
 *         description: The body does not correspond to the required body schema
 */
router.post('/', ValidateJoi(UserSchemas.register), async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const body = req.body as RegisterRequestBody;
    // Vérifiez si l'utilisateur existe déjà dans la base de données
    const userExists = await ElasticAuthDao.findByEmail(body.email);
    if (userExists) {
        return res.status(HTTP_STATUS_CODE.Conflict).json({ message: 'User already exists' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Création d'un nouvel utilisateur
    const user: RegsiterData = {
        email: body.email,
        password_hash: hashedPassword,
    };

    // Enregistrement de l'utilisateur dans la base de données
    try {
        await ElasticAuthDao.createUser(user);
        return res.status(HTTP_STATUS_CODE.Created).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(HTTP_STATUS_CODE.InternaleServerError).json({ message: 'Unable to create user', error });
    }
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequestBody:
 *       allOf:
 *         - $ref: '#/components/schemas/UserData'
 *
 */
