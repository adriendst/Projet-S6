import { BaseDao } from './Daos';
import { PrivateUser, RegsiterData } from '@steam-wiki/types';

export interface AuthDao extends BaseDao {
    createUser(user: RegsiterData): Promise<boolean>;

    findByEmail(email: string): Promise<PrivateUser | undefined>;
}

export default AuthDao;
