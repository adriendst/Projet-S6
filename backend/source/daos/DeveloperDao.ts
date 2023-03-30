import { CompletionParameters } from '../interfaces/dao/parameters';
import { BaseDao } from './Daos';

export interface DeveloperDao extends BaseDao {
    completeName(params: CompletionParameters): Promise<Array<string>>;
}

export default DeveloperDao;