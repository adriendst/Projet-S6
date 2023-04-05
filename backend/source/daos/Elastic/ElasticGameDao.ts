import logging from '../../config/logging';
import DEFAULTS from '../../config/defaults';
import GameDao from '../GameDao';
import { Game, CompletionParameters, FilterParameters, CompleteGameResponseBody, GetGameReponseBody, FilterGamesResponseBody } from '@steam-wiki/types';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import { ResponseError } from '@elastic/elasticsearch/lib/errors';
import { QueryContainer, Sort } from '@elastic/elasticsearch/api/types';
import { addAgeFilter, addCategoryFilter, addDateFilter, addDeveloperFilter, addGenreFilter, addNameFilter, addPlatformFilter, addPublisherFilter, getFuzzyFilter } from './utils/filters';
import { HTTP_STATUS } from '../../config/http_status';

const indexName = 'games';
const NAMESPACE = 'GAME_DAO';

const PAGE_SIZE = 50;

const ElasticGameDao: GameDao = {
    ...ElasticBaseDao,

    completeName({ searchText, results }: CompletionParameters): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const maxResultSize = results ?? DEFAULTS.autocompletion_results;
                const setQuery = searchText.trim().length > 0;

                const query = setQuery ? getFuzzyFilter(searchText, 'name.fuzzy', 'name.autocomplete') : undefined;
                const min_score = query ? Math.sqrt(searchText.length) : 0;

                const [gameRes, countRes] = await Promise.all([
                    ElasticConnector.instance.client.search<Game>({
                        index: indexName,
                        body: {
                            query,
                            size: maxResultSize,
                            min_score,
                        },
                    }),
                    ElasticConnector.instance.client.count({
                        index: indexName,
                        body: { query },
                        min_score,
                    }),
                ]);

                const response = {
                    searchText,
                    maxResults: maxResultSize,
                    totalResults: countRes.body.count,
                    min_score,
                    results: gameRes.body.hits.hits.map((doc) => doc._source!.name),
                    // results: gameRes.body.hits.hits.map((doc) => ({ name: doc._source!.name, score: doc._score })),
                };
                resolve(response);
            } catch (error) {
                logging.error(NAMESPACE, 'completeName', error);
                reject({ code: 500, message: 'An unexpected error occured', cause: error });
            }
        });
    },

    getGameById(params: { id: string }): Promise<GetGameReponseBody> {
        return new Promise<GetGameReponseBody>(async (resolve, reject) => {
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
                const game = results.reduce((acc, result) => (result !== null && result.body._source ? { ...acc, ...result.body._source } : acc), {});
                resolve({ game });
            } catch (error) {
                if (error instanceof ResponseError) {
                    console.log(NAMESPACE, 'RequestAbortedError', error);
                    reject({ code: error.statusCode, message: error.message, cause: error });
                } else {
                    reject({ ...HTTP_STATUS.InternaleServerError, cause: error });
                }
            }
        });
    },

    filterGames(page: number, params: FilterParameters): Promise<FilterGamesResponseBody> {
        return new Promise<FilterGamesResponseBody>(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'params', params);
                const filters: Array<QueryContainer> = [];
                const sort: Sort = [];
                addNameFilter(filters, params);
                addDeveloperFilter(filters, params);
                addPublisherFilter(filters, params);
                addPlatformFilter(filters, params);
                addCategoryFilter(filters, params);
                addGenreFilter(filters, params);
                addAgeFilter(filters, params);
                addDateFilter(filters, params);

                // If the order_by parameter is set, apply it
                if (params.order_by !== undefined) {
                    const orderType = params.order_type ?? DEFAULTS.sorting;
                    let orderBy = params.order_by ?? 'name';
                    if (orderBy === 'name') orderBy += '.keyword';
                    sort.push({ [orderBy]: { order: orderType } });
                }

                const query = { bool: { must: filters } };

                const [resultRes, countReds] = await Promise.all([
                    ElasticConnector.instance.client.search<Game>({
                        index: indexName,
                        body: {
                            query,
                            sort,
                            from: (page - 1) * PAGE_SIZE,
                            size: PAGE_SIZE,
                        },
                    }),
                    ElasticConnector.instance.client.count({
                        index: indexName,
                        body: { query },
                    }),
                ]);

                const response = {
                    page: page,
                    pageSize: PAGE_SIZE,
                    total: countReds.body.count,
                    totalPages: Math.ceil(countReds.body.count / PAGE_SIZE),
                    results: resultRes.body.hits.hits.map((doc) => doc._source?.release_date),
                    filters,
                };

                resolve(response);
            } catch (error) {
                reject({ ...HTTP_STATUS.InternaleServerError, cause: error });
            }
        });
    },
};

export default ElasticGameDao;
