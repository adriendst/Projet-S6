import logging from '../../config/logging';
import DEFAULTS from '../../config/defaults';
import { HTTP_STATUS } from '../../config/http_status';
import PublisherDao from '../PublisherDao';
import { Game, CompletionParameters } from '@steam-wiki/types';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import { QueryContainer, TermsAggregation } from '@elastic/elasticsearch/api/types';
import { DaoErrorHandler } from './utils/error_handler';

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
                let order: TermsAggregation['order'] | undefined = undefined;
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
                }
                if (params.searchText === undefined || params.searchText.length < 2) {
                    order = {
                        _key: 'asc',
                    };
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
                                    order,
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
                DaoErrorHandler(error, reject, NAMESPACE);
            }
        });
    },
};

export default ElasticPublisherDao;
