import type { Client as TypedClient } from '@elastic/elasticsearch/api/new';
import ElasticAuthDao from './Elastic/ElasticAuthDao';
import ElasticDeveloperDao from './Elastic/ElasticDeveloperDao';
import ElasticGameDao from './Elastic/ElasticGameDao';
import ElasticCategoryDao from './Elastic/ElasticCategoryDao';
import ElasticGenreDao from './Elastic/ElasticGenreDao';
import ElasticPublisherDao from './Elastic/ElasticPublisherDao';
import ElasticTagDao from './Elastic/ElasticTagDao';
import AuthDao from './AuthDao';
import GameDao from './GameDao';
import DeveloperDao from './DeveloperDao';
import PublisherDao from './PublisherDao';
import CategoryDao from './CategoryDao';
import GenreDao from './GenreDao';
import TagDao from './TagDao';

export interface BaseDao {
    destroy(): Promise<void>;
    client: TypedClient;
}

const DAOS: {
    AuthDao: AuthDao;
    GameDao: GameDao;
    DeveloperDao: DeveloperDao;
    PublisherDao: PublisherDao;
    CategoryDao: CategoryDao;
    GenreDao: GenreDao;
    TagDao: TagDao;
} = {
    AuthDao: ElasticAuthDao,
    GameDao: ElasticGameDao,
    DeveloperDao: ElasticDeveloperDao,
    PublisherDao: ElasticPublisherDao,
    CategoryDao: ElasticCategoryDao,
    GenreDao: ElasticGenreDao,
    TagDao: ElasticTagDao,
};

export default DAOS;
