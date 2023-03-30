import Joi from 'joi';
import { ROUTES_CONFIG } from '../config/defaults';
import { CompletionParameters } from '../interfaces/dao/parameters';

const CompletionSchemas = {
    default: Joi.object<CompletionParameters>({
        searchText: Joi.string().min(1),
        results: Joi.number().min(ROUTES_CONFIG.autocompletion.min).max(ROUTES_CONFIG.autocompletion.max).default(ROUTES_CONFIG.autocompletion.default),
    }),
};

export default CompletionSchemas;
