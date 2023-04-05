import { BaseDao } from './Daos';
import { GetAllTagsResponseBody } from '@steam-wiki/types';

interface TagDao extends BaseDao {
    getAll(): Promise<GetAllTagsResponseBody>;
}

export default TagDao;
