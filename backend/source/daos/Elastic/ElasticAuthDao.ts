import { ElasticBaseDao } from './ElasticConnector';
import AuthDao from '../AuthDao';
import { ILogin, IRegister, User } from '../../interfaces/auth';
import { IToken, ITokenData } from '../../interfaces/jwt';
const NAMESPACE = 'AUTH_DAO';
const indexName = 'user';

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
            index: indexName,
            body: {
                query: {
                    term: {
                        email: email,
                    },
                },
            },
        });
        console.log(body);
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
            index: indexName,
            body: { ...user, games: [] },
        });
        return body.result === 'created';
    },

    findToken: async function (tokenData: { userId: string; token: string; userAgent: string }): Promise<IToken | null> {
        const token = await ElasticBaseDao.tokens.findOne({
            userId: tokenData.userId,
            refreshToken: tokenData.token,
            userAgent: tokenData.userAgent,
        });

        return token || null;
    },
};

export default ElasticAuthDao;
