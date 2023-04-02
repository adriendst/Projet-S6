import { HTTP_STATUS } from '../../config/http_status';
import logging from '../../config/logging';
import { Game } from '../../interfaces/game';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import GenreDao from '../GenreDao';

const indexName = 'games';
const NAMESPACE = 'GENRE_DAO';

const ElasticGenreDao: GenreDao = {
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
                                    field: 'genres.keyword',
                                    size: 100,
                                },
                            },
                        },
                    },
                });

                // @ts-ignore
                const genres = body.aggregations!.unique_values.buckets.map((values: { key: string }) => values.key).sort((a, b) => a.localeCompare(b));
                resolve(genres);
            } catch (error) {
                console.log(error);
                reject({ ...HTTP_STATUS.InternaleServerError, cause: error });
            }
        });
    },
};

export default ElasticGenreDao;
