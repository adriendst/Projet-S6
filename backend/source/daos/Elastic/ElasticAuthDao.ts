import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import AuthDao from '../AuthDao';
import { ILogin, IRegister } from '../../interfaces/auth';

const ElasticAuthDao: AuthDao = {
    ...ElasticBaseDao,

    loginUser(params: ILogin): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    },
    insertToken: function (arg0: { userId: number; token: string; userAgent: string; }): unknown {
        throw new Error('Function not implemented.');
    },

    findByEmail: async function (email: string) {
    const client = ElasticBaseDao.client;
    const { body } = await client.search({
        index: 'user',
        body: {
          query: {
            term: {
              email: email
            }
          }
        }
      });
    const hits = body.hits.hits;
    if (hits.length === 0) {
      return null;
    }
    return hits[0]._source;
  },

  createUser: async function (user: IRegister) {
    const client = ElasticBaseDao.client;
    const { body } = await client.index({
        index: 'user',
        body: user
    });
    return body.result === 'created';
}

};

export default ElasticAuthDao;
