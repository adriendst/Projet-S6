import { ILogin } from '../interfaces/auth';
import { IToken, ITokenData } from '../interfaces/jwt';
import { BaseDao } from './Daos';

export interface ILoginResponse {
    data: ITokenData;
}

export interface IRefreshReponse {
    data: IToken;
}

export interface AuthDao extends BaseDao {
    loginUser(params: ILogin): Promise<ILoginResponse>;
}

export default AuthDao;
