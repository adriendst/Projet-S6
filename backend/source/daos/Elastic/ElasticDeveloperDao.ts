import DEFAULTS from '../../config/defaults';
import DeveloperDao from '../DeveloperDao';
import { CompleteDevelopersResponseBody, CompletionParameters, Game } from '@steam-wiki/types';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import { TermsAggregation } from '@elastic/elasticsearch/api/types';
import { DaoErrorHandler } from './utils/error_handler';
import { getFuzzyFilter } from './utils/filters';

const indexName = 'games';
const NAMESPACE = 'DEVELOPER_DAO';

const ElasticDeveloperDao: DeveloperDao = {
    ...ElasticBaseDao,

    completeName({ searchText, results }: CompletionParameters): Promise<CompleteDevelopersResponseBody> {
        return new Promise<CompleteDevelopersResponseBody>(async (resolve, reject) => {
            try {
                const maxResultSize = results ?? DEFAULTS.autocompletion_results;

                const setQuery = searchText.trim().length > 0;
                const query = setQuery ? getFuzzyFilter(searchText, 'developer.fuzzy', 'developer.autocomplete') : undefined;
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
                            unique_developers: {
                                terms: {
                                    field: 'publisher',
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
                    searchText,
                    maxResults: maxResultSize,
                    results: uniqueDevelopers,
                });
            } catch (error) {
                DaoErrorHandler(error, reject, NAMESPACE);
            }
        });
    },
};

export default ElasticDeveloperDao;
