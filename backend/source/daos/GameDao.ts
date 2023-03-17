import { BaseDao } from './Daos';

export interface GameDao extends BaseDao {
    getGameById(params: { id: string }): Promise<any>;

    searchGamesByName(params: { searchtext: string }): Promise<any>;
}

export default GameDao;
