import logging from '../../config/logging';
import DEFAULTS from '../../config/defaults';
import { HTTP_STATUS } from '../../config/http_status';
import PublisherDao from '../PublisherDao';
import { Game, CompletionParameters } from '@steam-wiki/types';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import { QueryContainer, TermsAggregation } from '@elastic/elasticsearch/api/types';
import { DaoErrorHandler } from './utils/error_handler';
import { getFuzzyFilter } from './utils/filters';

const indexName = 'games';
const NAMESPACE = 'PUBLISHER_DAO';

const ElasticPublisherDao: PublisherDao = {
    ...ElasticBaseDao,

    completeName({ searchText, results }: CompletionParameters): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const maxResultSize = results ?? DEFAULTS.autocompletion_results;

                const setQuery = searchText.trim().length > 0;
                const query = setQuery ? getFuzzyFilter(searchText, 'publisher.fuzzy', 'publisher.autocomplete') : undefined;
                let order: TermsAggregation['order'] | undefined = undefined;
                if (searchText === undefined || searchText.length < 2) {
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
                    searchText,
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
