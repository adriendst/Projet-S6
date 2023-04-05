import { IdParameters, GetGameReponseBody, CompletionParameters, CompleteGameResponseBody, FilterParameters, FilterGamesResponseBody } from '@steam-wiki/types';
import { BaseDao } from './Daos';

interface GameDao extends BaseDao {
    completeName(params: CompletionParameters): Promise<CompleteGameResponseBody>;

    getGameById(params: IdParameters): Promise<GetGameReponseBody>;

    filterGames(page: number, params: FilterParameters): Promise<FilterGamesResponseBody>;
}

export default GameDao;
