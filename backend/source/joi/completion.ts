import Joi from 'joi';
import { ROUTES_CONFIG } from '../config/defaults';
import { CompletionParameters } from '../interfaces/dao/parameters';
import { CompletionQuery } from '../interfaces/routes/completion';

const CompletionSchemas = {
    default: Joi.object<CompletionParameters>({
        searchText: Joi.string().min(1),
        results: Joi.number().min(ROUTES_CONFIG.autocompletion.min).max(ROUTES_CONFIG.autocompletion.max).default(ROUTES_CONFIG.autocompletion.default),
    }),
    searchText: Joi.object({
        searchText: Joi.string().min(1),
    }),
    results: Joi.object({
        results: Joi.number().min(ROUTES_CONFIG.autocompletion.min).max(ROUTES_CONFIG.autocompletion.max).default(ROUTES_CONFIG.autocompletion.default).optional(),
    }),
};

export default CompletionSchemas;
