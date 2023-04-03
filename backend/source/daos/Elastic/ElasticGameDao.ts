import { QueryContainer, Sort } from '@elastic/elasticsearch/api/types';
import { RequestAbortedError, ResponseError } from '@elastic/elasticsearch/lib/errors';
import DEFAULTS from '../../config/defaults';
import { HTTP_STATUS, HTTP_STATUS_CODE } from '../../config/http_status';
import logging from '../../config/logging';
import { CompletionParameters } from '../../interfaces/dao/parameters';
import { FilterParameters } from '../../interfaces/filter';
import { Game } from '../../interfaces/game';
import GameDao from '../GameDao';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';

const indexName = 'games';
const NAMESPACE = 'GAME_DAO';

const PAGE_SIZE = 50;

const ElasticGameDao: GameDao = {
    ...ElasticBaseDao,

    completeName(params: CompletionParameters): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'completeName', params);

                const maxResultSize = params.results ?? DEFAULTS.autocompletion_results;

                const query = {
                    // bool: {
                    //     should: [
                    //         {
                    //             fuzzy: {
                    //                 'name.fuzzy': {
                    //                     value: params.searchText,
                    //                     fuzziness: '3',
                    //                     prefix_length: 2,
                    //                 },
                    //             },
                    //         },
                    //         {
                    //             match: {
                    //                 'name.fuzzy': {
                    //                     query: params.searchText,
                    //                     fuzziness: '2',
                    //                     prefix_length: 2,
                    //                 },
                    //             },
                    //         },
                    //         {
                    //             match_bool_prefix: {
                    //                 'name.autocomplete': {
                    //                     query: params.searchText,
                    //                 },
                    //             },
                    //         },
                    //     ],
                    //     minimum_should_match: 1,
                    // },

                    match: {
                        'name.fuzzy': {
                            query: params.searchText,
                            fuzziness: 2,
                            prefix_length: 1,
                            boost: 2,
                        },
                    },
                };

                logging.info(NAMESPACE, 'completeName took:', params.results);

                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: indexName,
                    body: {
                        query,
                        size: maxResultSize,
                    },
                });

                const countRes = await ElasticConnector.instance.client.count({
                    index: indexName,
                    body: { query },
                });

                logging.info(NAMESPACE, 'completeName took:', body.took);
                resolve({
                    searchText: params.searchText,
                    maxResults: maxResultSize,
                    total: countRes.body.count,
                    results: body.hits.hits.map((doc) => doc._source!.name),
                });
            } catch (error) {
                logging.error(NAMESPACE, 'completeName', error);
                reject({ code: 500, message: 'An unexpected error occured', cause: error });
            }
        });
    },

    getGameById(params: { id: string }): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'getGameById', params);
                const indicies = [indexName, 'description', 'media', 'support', 'requirements'];
                const results = await Promise.all(
                    indicies.map((index) =>
                        ElasticConnector.instance.client
                            .get({
                                index: index,
                                id: params.id,
                            })
                            .catch(() => null),
                    ),
                );
                let body = {};
                for (const result of results) {
                    if (result !== null && result.body._source) {
                        body = { ...body, ...result.body._source };
                    }
                }
                resolve(body);
            } catch (error) {
                if (error instanceof ResponseError) {
                    console.log(NAMESPACE, 'RequestAbortedError', error);
                    reject({ code: error.statusCode, message: error.message, cause: error });
                } else {
                    reject({ code: 500, message: 'Internal server error', cause: error });
                }
            }
        });
    },

    filterGames(page: number, params: FilterParameters): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'params', params);
                const filters: Array<QueryContainer> = [];
                const sort: Sort = [];
                if (params.name !== undefined) {
                    filters.push({
                        match: {
                            'name.fuzzy': {
                                query: params.name,
                                fuzziness: 2,
                                prefix_length: 1,
                                boost: 2,
                            },
                        },
                    });
                }
                if (params.developers !== undefined) {
                    if (Array.isArray(params.developers)) filters.push({ terms: { developer: params.developers } });
                    else filters.push({ term: { developer: params.developers } });
                }
                if (params.publishers !== undefined) {
                    if (Array.isArray(params.publishers)) filters.push({ terms: { publisher: params.publishers } });
                    else filters.push({ term: { publisher: params.publishers } });
                }
                if (params.platforms !== undefined && params.platforms.length > 0) {
                    if (Array.isArray(params.platforms)) {
                        if (params.and_platforms) filters.push(...params.platforms.map((platform) => ({ term: { platforms: platform } })));
                        else filters.push({ terms: { platforms: params.platforms } });
                    } else filters.push({ term: { platforms: params.platforms } });
                }
                if (params.categories !== undefined && params.categories.length > 0) {
                    if (Array.isArray(params.categories)) filters.push(...params.categories.map((category) => ({ term: { 'categories.keyword': category } })));
                    else filters.push({ term: { 'categories.keyword': params.categories } });
                }
                if (params.genres !== undefined && params.genres.length > 0) {
                    if (Array.isArray(params.genres)) filters.push(...params.genres.map((genre) => ({ term: { 'genres.keyword': genre } })));
                    else filters.push({ term: { 'genres.keyword': params.genres } });
                }
                if (params.required_age !== undefined) {
                    filters.push({ range: { required_age: { gte: 0, lte: params.required_age } } });
                }
                if (params.start_date !== undefined) {
                    if (params.start_date.length === 4 && params.end_date === undefined) {
                        filters.push({ range: { release_date: { gte: `${params.start_date}-01-01`, lte: `${params.start_date}-12-31` } } });
                    } else {
                        filters.push({ range: { release_date: { gte: params.start_date, lte: params.end_date ?? params.start_date } } });
                    }
                }
                logging.info(NAMESPACE, 'filters', filters);

                if (params.order_by !== undefined) {
                    const orderType = params.order_type ?? DEFAULTS.sorting;
                    let orderBy = params.order_by ?? 'name';
                    if (orderBy === 'name') orderBy += '.keyword';
                    const sorter = {} as any;
                    sorter[orderBy] = { order: orderType };
                    sort.push(sorter);
                }

                const query = {
                    bool: {
                        must: filters,
                    },
                };

                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: indexName,
                    body: {
                        query,
                        sort,
                        from: (page - 1) * PAGE_SIZE,
                        size: PAGE_SIZE,
                    },
                });

                const countRes = await ElasticConnector.instance.client.count({
                    index: indexName,
                    body: { query },
                });
                resolve({
                    page: page,
                    total: countRes.body.count,
                    results: body.hits.hits.map((doc) => doc._source),
                });
                // resolve(body.hits.hits.map((hit) => hit._source));
                // resolve(body);
            } catch (error) {
                reject({ code: 500, message: 'An unexpected error occured', cause: error });
            }
        });
    },
};

const getFuzzyFilter = (query: string): QueryContainer => {
    return {
        match: {
            'name.fuzzy': {
                query,
                fuzziness: 'AUTO',
                operator: 'AND',
                prefix_length: 2,
            },
        },
    };
};

export default ElasticGameDao;
