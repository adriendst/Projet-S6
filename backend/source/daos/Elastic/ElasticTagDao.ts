import logging from '../../config/logging';
import { HTTP_STATUS } from '../../config/http_status';
import TagDao from '../TagDao';
import { Game, GetAllTagsResponseBody } from '@steam-wiki/types';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';

const NAMESPACE = 'TAG_DAO';

const ElasticTagDao: TagDao = {
    ...ElasticBaseDao,

    getAll(): Promise<GetAllTagsResponseBody> {
        return new Promise<GetAllTagsResponseBody>(async (resolve, reject) => {
            try {
                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: 'games',
                    body: {
                        size: 0,
                        aggs: {
                            unique_values: {
                                terms: {
                                    field: 'steamspy_tags.keyword',
                                    size: 250,
                                },
                            },
                        },
                    },
                });

                // @ts-ignore
                const tags = body.aggregations!.unique_values.buckets.map((values: { key: string }) => values.key).sort((a, b) => a.localeCompare(b));
                resolve({ results: tags });
            } catch (error) {
                logging.error(NAMESPACE, 'getAll', error);
                reject({ ...HTTP_STATUS.InternaleServerError, cause: error });
            }
        });
    },
};

export default ElasticTagDao;
