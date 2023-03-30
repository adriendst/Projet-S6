import type { Client as TypedClient } from '@elastic/elasticsearch/api/new';
import ElasticAuthDao from './Elastic/ElasticAuthDao';
import ElasticDeveloperDao from './Elastic/ElasticDeveloperDao';
import ElasticGameDao from './Elastic/ElasticGameDao';

export interface BaseDao {
    destroy(): Promise<void>;
    client: TypedClient;
}

export default {
    AuthDao: ElasticAuthDao,
    GameDao: ElasticGameDao,
    DeveloperDao: ElasticDeveloperDao,
};
