import { PrivateUser } from '@steam-wiki/types';
import { BaseDao } from './Daos';

interface UserDao extends BaseDao {
    getById(userId: string): Promise<PrivateUser>;

    insertToken(params: { userId: string; token: string; userAgent: string }): Promise<any>;

    deleteToken(params: { userId: string; token: string; userAgent: string }): Promise<boolean>;

    toggleLibraryGame(userId: string, gameId: string): Promise<any>;
}

export default UserDao;
