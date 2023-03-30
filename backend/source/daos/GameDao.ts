import { CompletionParameters } from '../interfaces/dao/parameters';
import { FilterParameters } from '../interfaces/filter';
import { BaseDao } from './Daos';

export interface GameDao extends BaseDao {
    completeName(params: CompletionParameters): Promise<Array<string>>;

    completeDeveloper(params: CompletionParameters): Promise<any>;

    getGameById(params: { id: string }): Promise<any>;

    filterGames(page: number, params: FilterParameters): Promise<any>;
}

export default GameDao;
