import { GetAllCategoriesResponseBody } from '@steam-wiki/types';

export interface CategoryDao {
    getAll(): Promise<GetAllCategoriesResponseBody>;
}

export default CategoryDao;
