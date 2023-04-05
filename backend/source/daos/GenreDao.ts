import { GetAllGenresResponseBody } from '@steam-wiki/types';

interface GenreDao {
    getAll(): Promise<GetAllGenresResponseBody>;
}

export default GenreDao;
