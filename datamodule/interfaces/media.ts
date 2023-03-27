import { IMovie } from './movie';
import { IScreenshot } from './screenshot';

export interface IRawMediaData {
    steam_appid: string;
    header_image: string;
    screenshots: string;
    background: string;
    movies: string;
}

export interface IMediaDocument {
    appid: string;
    header_image: string;
    screenshots: Array<IScreenshot>;
    background: string;
    movies?: Array<IMovie>;
}
