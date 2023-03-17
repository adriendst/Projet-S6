import ElasticConnector, { ElasticBaseDao } from './ElasticConnector';
import AuthDao from '../AuthDao';
import { ILogin } from '../../interfaces/auth';

const ElasticAuthDao: AuthDao = {
    ...ElasticBaseDao,

    loginUser(params: ILogin): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
};

export default ElasticAuthDao;
