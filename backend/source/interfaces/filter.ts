import { CATEGORY } from './types/category';
import { GENRE } from './types/genre';
import { PLATFORM } from './types/platform';
import { STEAMSPY_TAG } from './types/steamspy_tag';

export interface FilterParameters {
    searchText?: string; //ASC / DESC
    startDate?: Date;
    endDate?: Date; // IF endDate is present == range else exact date
    developers?: string | Array<string>;
    publishers?: string | Array<string>;
    platforms?: PLATFORM | Array<PLATFORM>;
    and_platforms?: boolean;
    required_age?: number;
    categories?: CATEGORY | Array<CATEGORY>;
    genres?: GENRE | Array<GENRE>;
    tags?: STEAMSPY_TAG | Array<STEAMSPY_TAG>;
    orderBy?: string;
    orderType?: 'asc' | 'desc';
}
