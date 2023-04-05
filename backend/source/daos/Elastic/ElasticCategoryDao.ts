import logging from '../../config/logging';
import { HTTP_STATUS } from '../../config/http_status';
import { Game, GetAllCategoriesResponseBody } from '@steam-wiki/types';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import CategoryDao from '../CategoryDao';
import { DaoErrorHandler } from './utils/error_handler';

const indexName = 'games';
const NAMESPACE = 'CATEGORY_DAO';

const ElasticCategoryDao: CategoryDao = {
    ...ElasticBaseDao,

    getAll(): Promise<GetAllCategoriesResponseBody> {
        return new Promise<GetAllCategoriesResponseBody>(async (resolve, reject) => {
            try {
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
                DaoErrorHandler(error, reject, NAMESPACE);
            }
        });
    },
};

export default ElasticCategoryDao;
