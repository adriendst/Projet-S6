import { BaseDao } from './Daos';
import { CompletionParameters, CompletePublishersResponseBody } from '@steam-wiki/types';

interface PublisherDao extends BaseDao {
    completeName(params: CompletionParameters): Promise<CompletePublishersResponseBody>;
}

export default PublisherDao;
