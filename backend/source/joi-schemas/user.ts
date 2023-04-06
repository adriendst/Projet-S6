import DateExtension from '@joi/date';
import JoiImport from 'joi';
import { LoginRequestBody, RegisterRequestBody, JWTToken } from '@steam-wiki/types';

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
    login: Joi.object<LoginRequestBody>({
        email: UserProperties.email.required(),
        password: UserProperties.password.required(),
    }),
    logout: Joi.object<JWTToken>({
        refreshToken: UserProperties.refreshToken.required(),
    }),
    refresh: Joi.object<JWTToken>({
        refreshToken: UserProperties.refreshToken.required(),
    }),
    delete: Joi.object({
        password: UserProperties.password.required(),
    }),
};

export default UserSchemas;
