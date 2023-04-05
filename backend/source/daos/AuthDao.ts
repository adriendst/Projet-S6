import { ILogin, IRegister } from '../interfaces/auth';
import { IToken, ITokenData } from '../interfaces/jwt';
import { BaseDao } from './Daos';

export interface ILoginResponse {
    code: number;
    message: any;
    data: ITokenData;
}

export interface IRefreshReponse {
    data: IToken;
}

export interface AuthDao extends BaseDao {
    insertToken(arg0: { userId: number; token: string; userAgent: string }): unknown;

    loginUser(params: ILogin): Promise<ILoginResponse>;

    findByEmail(email: string): Promise<any>;

    createUser(user: IRegister): Promise<boolean>;
}

export default AuthDao;
