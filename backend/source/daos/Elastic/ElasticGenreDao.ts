import { Game } from '@steam-wiki/types';
import GenreDao from '../GenreDao';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import { DaoErrorHandler } from './utils/error_handler';

const indexName = 'games';
const NAMESPACE = 'GENRE_DAO';

const ElasticGenreDao: GenreDao = {
    ...ElasticBaseDao,

    getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: indexName,
                    body: {
                        size: 0,
                        aggs: {
                            unique_values: {
                                terms: {
                                    field: 'genres.keyword',
                                    size: 250,
                                },
                            },
                        },
                    },
                });

                // @ts-ignore
                const genres = body.aggregations!.unique_values.buckets.map((values: { key: string }) => values.key).sort((a, b) => a.localeCompare(b));
                resolve(genres);
            } catch (error) {
                DaoErrorHandler(error, reject, NAMESPACE);
            }
        });
    },
};

export default ElasticGenreDao;
