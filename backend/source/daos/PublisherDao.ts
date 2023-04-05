import { CompletionParameters } from '../interfaces/dao/parameters';
import { BaseDao } from './Daos';

export interface PublisherDao extends BaseDao {
    completeName(params: CompletionParameters): Promise<Array<string>>;
}

export default PublisherDao;
