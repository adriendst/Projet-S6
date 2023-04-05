import { User } from '../interfaces/auth';
import { BaseDao } from './Daos';

interface UserDao extends BaseDao {
    getById(userId: string): Promise<User>;

    toggleLibraryGame(userId: string, gameId: string): Promise<any>;
}

export default UserDao;
