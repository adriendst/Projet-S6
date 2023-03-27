export interface IMovie {
    id: number;
    name: string;
    thumbnail: string;
    webm: {
        '480': string;
        max: string;
    };
    highlight: boolean;
}
