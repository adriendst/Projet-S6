import Joi from 'joi';

const QuerySchemas = {
    id: Joi.object<{ id: string }>({
        id: Joi.string().min(1).required(),
    }),
    numberId: Joi.object<{ id: number }>({
        id: Joi.number().min(1).required(),
    }),
};

export default QuerySchemas;
