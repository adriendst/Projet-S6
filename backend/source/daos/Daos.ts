import { Client } from '@elastic/elasticsearch';
import ElasticAuthDao from './Elastic/ElasticAuthDao';
import ElasticGameDao from './Elastic/ElasticGameDao';

export interface BaseDao {
    destroy(): Promise<void>;
    client: Client;
}

export default {
    AuthDao: ElasticAuthDao,
    GameDao: ElasticGameDao
};
