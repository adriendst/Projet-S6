export interface GenreDao {
    getAll(): Promise<Array<string>>;
}

export default GenreDao;
