import { QueryContainer, Sort, SortContainer } from '@elastic/elasticsearch/api/types';
import DEFAULTS from '../../config/defaults';
import { HTTP_STATUS } from '../../config/http_status';
import logging from '../../config/logging';
import { CompletionParameters } from '../../interfaces/dao/parameters';
import { Game } from '../../interfaces/game';
import PublisherDao from '../PublisherDao';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';

const indexName = 'games';
const NAMESPACE = 'PUBLISHER_DAO';

const ElasticPublisherDao: PublisherDao = {
    ...ElasticBaseDao,

    completeName(params: CompletionParameters): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'completeName', params);

                const maxResultSize = params.results ?? DEFAULTS.autocompletion_results;

                let query: QueryContainer | undefined = undefined;
                let sort: Sort = [];
                if (params.searchText !== undefined && params.searchText.length !== 0) {
                    query = {
                        bool: {
                            should: [
                                {
                                    match: {
                                        'publisher.fuzzy': {
                                            query: params.searchText,
                                            fuzziness: 2,
                                            prefix_length: 1,
                                            boost: 2,
                                        },
                                    },
                                },
                                {
                                    match_bool_prefix: {
                                        'publisher.autocomplete': {
                                            query: params.searchText,
                                            fuzziness: 2,
                                            boost: 2,
                                        },
                                    },
                                },
                            ],
                            minimum_should_match: 1,
                        },
                    };
                } else {
                    sort.push({
                        publisher: { order: 'desc' },
                    });
                }

                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: indexName,
                    body: {
                        query,
                        size: 0,
                        aggs: {
                            unique_publishers: {
                                terms: {
                                    field: 'publisher',
                                    size: maxResultSize,
                                },
                            },
                        },
                    },
                });

                let publishers = [];
                if (body.aggregations !== undefined) {
                    // @ts-ignore
                    publishers = body.aggregations.unique_publishers.buckets;
                }
                const uniquePublishers = publishers.map(({ key }: { key: string }) => key);

                resolve({
                    searchText: params.searchText,
                    maxResults: maxResultSize,
                    results: uniquePublishers,
                });
            } catch (error) {
                logging.error(NAMESPACE, 'completeName', error);
                reject({ ...HTTP_STATUS.InternaleServerError, cause: error });
            }
        });
    },
};

export default ElasticPublisherDao;
