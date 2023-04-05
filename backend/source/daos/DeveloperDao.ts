import { BaseDao } from './Daos';
import { CompletionParameters, CompleteDevelopersResponseBody } from '@steam-wiki/types';

interface DeveloperDao extends BaseDao {
    completeName(params: CompletionParameters): Promise<CompleteDevelopersResponseBody>;
}

export default DeveloperDao;
