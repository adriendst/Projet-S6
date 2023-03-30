import { CATEGORY } from './types/category';
import { PLATFORM } from './types/platform';
import { GENRE } from './types/genre';
import { OWNER_COUNT } from './types/owner_count';
import { STEAMSPY_TAG } from './types/steamspy_tag';

export interface Game {
    appid: string;
    name: string;
    release_date: Date;
    english: boolean;
    developer: string;
    publisher: string;
    platforms: Array<PLATFORM>;
    required_age: number;
    categories: Array<CATEGORY>;
    genres: Array<GENRE>;
    steamspy_tags: Array<STEAMSPY_TAG>;
    achievements: number;
    positive_ratings: number;
    negative_ratings: number;
    average_playtime: number;
    median_playtime: number;
    owners: OWNER_COUNT;
    price: number;
}
