import DEFAULTS, { SORTING_OPTIONS } from '../config/defaults';
import JoiImport from 'joi';
import DateExtension from '@joi/date';
import { FilterParameters } from '@steam-wiki/types';

const Joi = JoiImport.extend(DateExtension) as typeof JoiImport;

const fullDateSchema = Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/)
    .optional();
const yearSchema = Joi.string()
    .pattern(/^\d{4}$/)
    .optional();
const stringSchema = Joi.string().optional();
const stringArraySchema = Joi.array().items(stringSchema).optional();
const stringAlternativesSchema = Joi.alternatives().try(stringSchema, stringArraySchema);
const platformStringSchema = Joi.string().valid('windows', 'linux', 'mac').optional();

const FilterSchemas = {
    gameFilter: Joi.object<FilterParameters>({
        name: Joi.string().optional(),
        start_date: Joi.alternatives().try(fullDateSchema, yearSchema),
        end_date: Joi.alternatives().try(fullDateSchema, yearSchema),
        developers: stringAlternativesSchema,
        publishers: stringAlternativesSchema,
        platforms: Joi.alternatives().try(platformStringSchema, Joi.array().items(platformStringSchema).optional()),
        and_platforms: Joi.boolean().optional().default(DEFAULTS.and_platforms),
        required_age: Joi.number().integer().positive().optional(),
        categories: stringAlternativesSchema,
        genres: stringAlternativesSchema,
        order_by: Joi.string()
            .valid(...SORTING_OPTIONS)
            .optional(),
        order_type: Joi.string().valid('asc', 'desc').optional().default(DEFAULTS.sorting),
    }),
};

export default FilterSchemas;
