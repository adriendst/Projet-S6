import express, { Request, Response } from 'express';
import UserSchemas from '../schemas/User';
import ElasticAuthDao from '../daos/Elastic/ElasticAuthDao';
import { IRegister } from '../interfaces/auth';
import bcrypt from 'bcrypt';

const router = express.Router();
export default router;

interface RegisterRequest {
  email: string;
  password: string;
}

router.post('/register', async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
  // Vérifiez que les données d'entrée sont valides en utilisant le schéma Joi
  const { error } = UserSchemas.register.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Vérifiez si l'utilisateur existe déjà dans la base de données
  const userExists = await ElasticAuthDao.findByEmail(req.body.email);
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Création d'un nouvel utilisateur
  const user: IRegister = {
    email: req.body.email,
    password: hashedPassword,
  };

  // Enregistrement de l'utilisateur dans la base de données
  try {
    await ElasticAuthDao.createUser(user);
    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to create user' });
  }
});
