import { CATEGORY } from './category';
import { GENRE } from './genre';
import { OWNER_COUNT } from './owner_count';
import { PLATFORM } from './platform';
import { STEAMSPY_TAG } from './steamspy_tag';

export interface IRawGameData {
    appid: string;
    name: string;
    release_date: string;
    english: string;
    developer: string;
    publisher: string;
    platforms: string;
    required_age: string;
    categories: string;
    genres: string;
    steamspy_tags: string;
    achievements: string;
    positive_ratings: string;
    negative_ratings: string;
    average_playtime: string;
    median_playtime: string;
    owners: string;
    price: string;
}

export interface IGame {
    appid: number;
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
