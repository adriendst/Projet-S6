import { ElasticBaseDao } from './ElasticConnector';
import AuthDao from '../AuthDao';
import { RegsiterData, PrivateUser } from '@steam-wiki/types';
const NAMESPACE = 'AUTH_DAO';
const indexName = 'user';

const ElasticAuthDao: AuthDao = {
    ...ElasticBaseDao,

    findByEmail: async function (email: string): Promise<PrivateUser | undefined> {
        const { body } = await ElasticBaseDao.client.search({
            index: indexName,
            body: {
                query: {
                    term: {
                        email,
                    },
                },
            },
        });

        if (body.hits.hits.length === 0) return undefined;

        const userDoc = body.hits.hits[0] as {
            _id: string;
            _source: any;
        };
        return { ...userDoc._source, id: userDoc._id };
    },

    createUser: async function (user: RegsiterData) {
        const { body } = await ElasticBaseDao.client.index({
            index: indexName,
            body: { ...user, games: [] },
        });
        return body.result === 'created';
    },
};

export default ElasticAuthDao;
