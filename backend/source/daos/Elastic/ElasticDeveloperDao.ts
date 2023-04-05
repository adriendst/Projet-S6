import logging from '../../config/logging';
import DEFAULTS from '../../config/defaults';
import { HTTP_STATUS } from '../../config/http_status';
import DeveloperDao from '../DeveloperDao';
import { CompleteDevelopersResponseBody, CompletionParameters, Game } from '@steam-wiki/types';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import { QueryContainer, TermsAggregation } from '@elastic/elasticsearch/api/types';

const indexName = 'games';
const NAMESPACE = 'DEVELOPER_DAO';

const ElasticDeveloperDao: DeveloperDao = {
    ...ElasticBaseDao,

    completeName(params: CompletionParameters): Promise<CompleteDevelopersResponseBody> {
        return new Promise<CompleteDevelopersResponseBody>(async (resolve, reject) => {
            try {
                const maxResultSize = params.results ?? DEFAULTS.autocompletion_results;

                let query: QueryContainer | undefined = undefined;
                let order: TermsAggregation['order'] | undefined = undefined;
                if (params.searchText !== undefined && params.searchText.length !== 0) {
                    query = {
                        bool: {
                            should: [
                                {
                                    match: {
                                        'developer.fuzzy': {
                                            query: params.searchText,
                                            fuzziness: 2,
                                            prefix_length: 1,
                                            boost: 2,
                                        },
                                    },
                                },
                                {
                                    match_bool_prefix: {
                                        'developer.autocomplete': {
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
                            unique_developers: {
                                terms: {
                                    field: 'developer',
                                    size: maxResultSize,
                                    order,
                                },
                            },
                        },
                    },
                });

                let developers = [];
                if (body.aggregations !== undefined) {
                    // @ts-ignore
                    developers = body.aggregations.unique_developers.buckets;
                }
                const uniqueDevelopers = developers.map(({ key }: { key: string }) => key);

                resolve({
                    searchText: params.searchText,
                    maxResults: maxResultSize,
                    results: uniqueDevelopers,
                });
            } catch (error) {
                logging.error(NAMESPACE, 'completeName', error);
                reject({ ...HTTP_STATUS.InternaleServerError, cause: error });
            }
        });
    },
};

export default ElasticDeveloperDao;
