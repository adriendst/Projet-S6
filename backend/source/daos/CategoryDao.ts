export interface CategoryDao {
    getCategories(): Promise<Array<string>>;
}

export default CategoryDao;
