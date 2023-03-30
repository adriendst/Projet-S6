import DEFAULTS from '../../config/defaults';
import { HTTP_STATUS } from '../../config/http_status';
import logging from '../../config/logging';
import { CompletionParameters } from '../../interfaces/dao/parameters';
import { Game } from '../../interfaces/game';
import DeveloperDao from '../DeveloperDao';
import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';

const indexName = 'games';
const NAMESPACE = 'DEVELOPER_DAO';

const ElasticDeveloperDao: DeveloperDao = {
    ...ElasticBaseDao,

    completeName(params: CompletionParameters): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                logging.info(NAMESPACE, 'completeDeveloper', params);

                const maxResultSize = params.results ?? DEFAULTS.autocompletion_results;

                const { body } = await ElasticConnector.instance.client.search<Game>({
                    index: indexName,
                    body: {
                        suggest: {
                            developer_suggest: {
                                prefix: params.searchText,
                                completion: {
                                    field: 'developer.completion',
                                    size: maxResultSize,
                                    skip_duplicates: true,
                                },
                            },
                        },
                    },
                });

                resolve({
                    searchText: params.searchText,
                    maxResults: maxResultSize,
                    results: body.suggest?.developer_suggest[0].options.map((doc) => doc.text),
                });
                // resolve(body);
            } catch (error) {
                console.log(error);
                reject({ ...HTTP_STATUS.InternaleServerError, cause: error });
            }
        });
    },
};

export default ElasticDeveloperDao;
