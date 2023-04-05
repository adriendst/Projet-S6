import { ILogin, IRegister, User } from '../interfaces/auth';
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
    insertToken(arg0: { userId: string; token: string; userAgent: string }): unknown;

    loginUser(params: ILogin): Promise<ILoginResponse>;

    findByEmail(email: string): Promise<User | undefined>;

    createUser(user: IRegister): Promise<boolean>;

    findToken(tokenData: { userId: string; token: string; userAgent: string }): Promise<IToken | null>
}

export default AuthDao;
