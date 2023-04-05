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
    createUser(user: IRegister): Promise<boolean>;

    loginUser(params: ILogin): Promise<ILoginResponse>;

    insertToken(arg0: { userId: string; token: string; userAgent: string }): unknown;

    findByEmail(email: string): Promise<User | undefined>;

    createUser(user: IRegister): Promise<boolean>;
    
    findToken(tokenData: { userId: string; token: string; userAgent: string }): Promise<IToken | null>
}

export default AuthDao;
