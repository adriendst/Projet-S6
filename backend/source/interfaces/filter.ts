import { CATEGORY } from './types/category';
import { GENRE } from './types/genre';
import { PLATFORM } from './types/platform';
import { STEAMSPY_TAG } from './types/steamspy_tag';

export interface FilterParameters {
    name?: string;
    start_date?: string;
    end_date?: string;
    developers?: string | Array<string>;
    publishers?: string | Array<string>;
    platforms?: PLATFORM | Array<PLATFORM>;
    and_platforms?: boolean;
    required_age?: number;
    categories?: CATEGORY | Array<CATEGORY>;
    genres?: GENRE | Array<GENRE>;
    tags?: STEAMSPY_TAG | Array<STEAMSPY_TAG>;
    order_by?: string;
    order_type?: 'asc' | 'desc';
}
