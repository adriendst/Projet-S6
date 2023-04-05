import { ElasticBaseDao } from './ElasticConnector';
import AuthDao from '../AuthDao';
import { ILogin, IRegister, User } from '../../interfaces/auth';

const NAMESPACE = 'AUTH_DAO';

const ElasticAuthDao: AuthDao = {
    ...ElasticBaseDao,

    loginUser(params: ILogin): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    },

    insertToken: function (arg0: { userId: string; token: string; userAgent: string }): unknown {
        throw new Error('Function not implemented.');
    },

    findByEmail: async function (email: string): Promise<User | undefined> {
        const { body } = await ElasticBaseDao.client.search({
            index: 'user',
            body: {
                query: {
                    term: {
                        email: email,
                    },
                },
            },
        });
        if (body.hits.hits.length === 0) {
            return undefined;
        }
        const userDoc = body.hits.hits[0] as {
            _id: string;
            _source: any;
        };
        return { ...userDoc._source, id: userDoc._id };
    },

    createUser: async function (user: IRegister) {
        const { body } = await ElasticBaseDao.client.index({
            index: 'user',
            body: user,
        });
        return body.result === 'created';
    },
};

export default ElasticAuthDao;
