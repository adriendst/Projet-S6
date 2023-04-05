import DateExtension from '@joi/date';
import JoiImport from 'joi';
import { ILogin, RegisterRequestBody } from '../interfaces/auth';
import { IToken } from '../interfaces/jwt';

const Joi = JoiImport.extend(DateExtension) as typeof JoiImport;

export const UserProperties = {
    email: Joi.string().email(),
    password: Joi.string().min(8),
    refreshToken: Joi.string(),
};

const UserSchemas = {
    register: Joi.object<RegisterRequestBody>({
        email: UserProperties.email.required(),
        password: UserProperties.password.required(),
    }),
    login: Joi.object<ILogin>({
        email: UserProperties.email.required(),
        password: UserProperties.password.required(),
    }),
    refresh: Joi.object<IToken>({
        refreshToken: UserProperties.refreshToken.required(),
    }),
    delete: Joi.object({
        password: UserProperties.password.required(),
    }),
};

export default UserSchemas;
