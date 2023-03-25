import logging from '../../config/logging';
import GameDao from '../GameDao';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';

const indexName = 'games';
const NAMESPACE = 'GAME_DAO';

const ElasticGameDao: GameDao = {
    ...ElasticBaseDao,

    getGameById(params: { id: string }): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'getGameById', params);
                const { body } = await ElasticConnector.instance.client.get({
                    index: indexName,
                    id: params.id
                });
                resolve(body);
            } catch (error) {
                reject({ code: 404, message: 'Game not found', cause: error });
            }
        });
    },

    searchGamesByName(params: { searchtext: string; page?: number; size?: number; sortOrder?: string }): Promise<any> {
        const page = Math.max(params.page ?? 1, 1);
        const pageSize = params.size ?? 10;

        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'searchGamesByName', params);
                const { body } = await ElasticConnector.instance.client.search({
                    index: indexName,
                    body: {
                        query: {
                            fuzzy: {
                                name: {
                                    value: params.searchtext,
                                    fuzziness: 'AUTO',
                                    max_expansions: 50,
                                    prefix_length: 0,
                                    transpositions: true,
                                    rewrite: 'constant_score'
                                }
                            }
                        },
                        from: (page - 1) * pageSize,
                        size: pageSize,
                        sort: [{ name: { order: params.sortOrder ?? 'desc' } }]
                    }
                });
                resolve(body);
            } catch (error) {
                reject({ code: 404, message: 'Game not found', cause: error });
            }
        });
    }
};

export default ElasticGameDao;
