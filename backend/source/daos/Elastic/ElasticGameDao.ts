import { QueryContainer, Sort } from '@elastic/elasticsearch/api/types';
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

    completeName(params: CompletionParameters): Promise<Array<string>> {
        return new Promise<Array<string>>(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'completeName', params);

                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: indexName,
                    body: {
                        size: params.results ?? DEFAULTS.autocompletion_results,
                        query: {
                            // match: {
                            //     'name.fuzzy': {
                            //         query: params.searchText,
                            //         fuzziness: 'AUTO',
                            //         operator: 'AND',
                            //         prefix_length: 2,
                            //     },
                            // },
                            match_bool_prefix: {
                                'name.autocomplete': {
                                    query: params.searchText,
                                },
                            },
                        },
                    },
                });
                resolve(body.hits.hits.map((doc) => doc._source!.name));
            } catch (error) {
                console.log(error);
                reject({ code: 500, message: 'An unexpected error occured', cause: error });
            }
        });
    },

    completeDeveloper(params: CompletionParameters): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'completeDeveloper', params);

                const resultSize = params.results ?? DEFAULTS.autocompletion_results;

                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: indexName,
                    body: {
                        suggest: {
                            developer_suggest: {
                                prefix: params.searchText,
                                completion: {
                                    field: 'developer.completion',
                                    size: resultSize,
                                    skip_duplicates: true,
                                },
                            },
                        },
                    },
                });
                // resolve({ searchText: params.searchText, results: body.suggest?.developer_suggest[0].options.map((doc) => doc.text) });
                resolve(body);
            } catch (error) {
                console.log(error);
                reject({ code: 500, message: 'An unexpected error occured', cause: error });
            }
        });
    },

    getGameById(params: { id: string }): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'getGameById', params);
                const { body } = await ElasticConnector.instance.client.get({
                    index: indexName,
                    id: params.id,
                });
                resolve(body?._source);
            } catch (error) {
                reject({ code: 404, message: 'Game not found', cause: error });
            }
        });
    },

    filterGames(page: number, params: FilterParameters): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'params', params);
                const filters: Array<QueryContainer> = [];
                const sort: Sort = [];
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
                    if (Array.isArray(params.categories)) filters.push(...params.categories.map((category) => ({ term: { categories: category } })));
                    else filters.push({ term: { categories: params.categories } });
                }
                if (params.genres !== undefined && params.genres.length > 0) {
                    if (Array.isArray(params.genres)) filters.push(...params.genres.map((genre) => ({ term: { genres: genre } })));
                    else filters.push({ term: { genres: params.genres } });
                }
                if (params.required_age !== undefined) {
                    filters.push({ range: { required_age: { gte: 0, lte: params.required_age } } });
                }
                // if (params.startDate !== undefined) {
                //     filters.push({ range: { release_date: { lt: '1955-01-31', gt: '1955-01-01', format: 'yyyy-MM-dd', } } });
                // }
                logging.info(NAMESPACE, 'filters', filters);

                if (params.orderBy !== undefined) {
                    const orderType = params.orderType ?? 'asc';
                    const orderBy = params.orderBy ?? 'name';
                    const sorter = {} as any;
                    sorter[orderBy] = { order: orderType };
                    sort.push(sorter);
                }
                logging.info(NAMESPACE, 'filters', filters);

                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: indexName,
                    body: {
                        query: {
                            bool: {
                                must: filters,
                            },
                        },
                        sort,
                        from: (page - 1) * PAGE_SIZE,
                        size: PAGE_SIZE,
                    },
                });
                resolve(body.hits.hits.map((doc) => doc._source!.developer));
                // resolve(body.hits.hits.map((hit) => hit._source));
                // resolve(body);
            } catch (error) {
                reject({ code: 500, message: 'An unexpected error occured', cause: error });
            }
        });
    },
};

export default ElasticGameDao;
