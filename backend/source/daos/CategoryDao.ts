import { BaseDao } from './Daos';

export interface CategoryDao {
    getCategories(): Promise<Array<string>>;
}

export default CategoryDao;
