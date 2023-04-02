import { HTTP_STATUS } from '../../config/http_status';
import logging from '../../config/logging';
import { Game } from '../../interfaces/game';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import CategoryDao from '../CategoryDao';

const indexName = 'games';
const NAMESPACE = 'CATEGORY_DAO';

const ElasticCategoryDao: CategoryDao = {
    ...ElasticBaseDao,

    getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'getAll');

                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: indexName,
                    body: {
                        size: 0,
                        aggs: {
                            unique_values: {
                                terms: {
                                    field: 'categories.keyword',
                                    size: 100,
                                },
                            },
                        },
                    },
                });

                // @ts-ignore
                const categories = body.aggregations!.unique_values.buckets.map((values: { key: string }) => values.key).sort((a, b) => a.localeCompare(b));
                resolve(categories);
            } catch (error) {
                console.log(error);
                reject({ ...HTTP_STATUS.InternaleServerError, cause: error });
            }
        });
    },
};

export default ElasticCategoryDao;
