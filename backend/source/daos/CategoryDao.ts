export interface CategoryDao {
    getAll(): Promise<Array<string>>;
}

export default CategoryDao;
