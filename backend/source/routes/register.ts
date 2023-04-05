import express, { Request, Response } from 'express';
import UserSchemas from '../schemas/User';
import ElasticAuthDao from '../daos/Elastic/ElasticAuthDao';
import { IRegister, RegisterRequestBody } from '../interfaces/auth';
import bcrypt from 'bcrypt';
import { HTTP_STATUS_CODE } from '../config/http_status';
import { ValidateJoi } from '../middleware/joi';

const router = express.Router();

/**
 * @swagger
 * /v1/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Register]
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: The request body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequestBody'
 *     responses:
 *       200:
 *         description: Sucessfully retrived publishers names
 *       422:
 *         description: The entered parameters do not correspond to the schema
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
    const user: IRegister = {
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
 * tags:
 *   name: Register
 *   description: The register managing API endpoint
 *
 * components:
 *   schemas:
 *     RegisterRequestBody:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: email
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         email: test123@mail.com
 *         password: Password123!
 *
 */
