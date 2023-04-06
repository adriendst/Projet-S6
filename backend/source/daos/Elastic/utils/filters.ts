import { QueryContainer } from '@elastic/elasticsearch/api/types';
import { FilterParameters } from '@steam-wiki/types';
import logging from '../../../config/logging';

export const getFuzzyFilter = (searchTerm: string, matchField: string, prefixField: string): QueryContainer => {
    return {
        bool: {
            should: [
                {
                    match: {
                        [matchField]: {
                            query: searchTerm,
                            operator: 'AND',
                            fuzziness: 'AUTO',
                            prefix_length: 1,
                        },
                    },
                },
                {
                    match_bool_prefix: {
                        [prefixField]: {
                            query: searchTerm,
                            fuzziness: 2,
                            boost: 2,
                        },
                    },
                },
            ],
            minimum_should_match: 1,
        },
    };
};

export const addNameFilter = (filters: Array<QueryContainer>, { name }: FilterParameters) => {
    addFuzzyFilter(filters, name, 'name');
};

export const addDeveloperFilter = (filters: Array<QueryContainer>, { developers }: FilterParameters) => {
    addFuzzyFilter(filters, developers, 'developer');
};

export const addPublisherFilter = (filters: Array<QueryContainer>, { publishers }: FilterParameters) => {
    addFuzzyFilter(filters, publishers, 'publisher');
};

const addFuzzyFilter = (filters: Array<QueryContainer>, fuzzyTerms: string | undefined | Array<string>, fieldName: string) => {
    if (fuzzyTerms === undefined) return;

    if (Array.isArray(fuzzyTerms)) filters.push(...fuzzyTerms.map((fuzzyTerm) => getFuzzyFilter(fuzzyTerm, `${fieldName}.fuzzy`, `${fieldName}.autocomplete`)));
    else filters.push(getFuzzyFilter(fuzzyTerms, `${fieldName}.fuzzy`, `${fieldName}.autocomplete`));
};

export const addPlatformFilter = (filters: Array<QueryContainer>, { platforms, and_platforms }: FilterParameters) => {
    addKeywordFilter(filters, platforms, 'platforms', and_platforms);
};

export const addCategoryFilter = (filters: Array<QueryContainer>, { categories }: FilterParameters) => {
    addKeywordFilter(filters, categories, 'categories.keyword');
};

export const addGenreFilter = (filters: Array<QueryContainer>, { genres }: FilterParameters) => {
    addKeywordFilter(filters, genres, 'genres.keyword');
};

export const addAgeFilter = (filters: Array<QueryContainer>, { required_age }: FilterParameters) => {
    if (required_age === undefined) return;

    filters.push({ range: { required_age: { gte: required_age } } });
};

export const addDateFilter = (filters: Array<QueryContainer>, { start_date, end_date }: FilterParameters) => {
    if (start_date === undefined) return;

    if (start_date.length === 4 && end_date === undefined) {
        filters.push({ range: { release_date: { gte: `${start_date}-01-01`, lte: `${start_date}-12-31` } } });
        return;
    }

    const startDate = start_date.length === 4 ? `${start_date}-01-01` : start_date;
    const endDate = end_date === undefined ? start_date : end_date.length === 4 ? `${end_date}-12-31` : end_date;
    filters.push({ range: { release_date: { gte: startDate, lte: endDate } } });
};

const addKeywordFilter = (filters: Array<QueryContainer>, keywords: string | undefined | Array<string>, key: string, and_operator: boolean = true) => {
    if (keywords === undefined || keywords.length < 1) return;

    if (!Array.isArray(keywords)) {
        filters.push({ term: { [key]: keywords } });
        return;
    }

    if (and_operator) filters.push(...keywords.map((keyword) => ({ term: { [key]: keyword } })));
    else filters.push({ terms: { [key]: keywords } });
};

export const addGamesFilter = (filters: Array<QueryContainer>, { user_only, games }: FilterParameters) => {
    if (user_only === false || games === undefined || games.length === 0) return;

    filters.push({ terms: { _id: games } });
};
