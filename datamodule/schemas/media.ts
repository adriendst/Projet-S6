import { TypeMapping } from '@elastic/elasticsearch/api/types';

export const MEDIA_MAPPINGS: TypeMapping = {
    dynamic: 'strict',
    properties: {
        appid: {
            type: 'keyword',
        },
        header_image: {
            type: 'text',
            index: false,
        },
        screenshots: {
            type: 'nested',
            properties: {
                id: { type: 'integer' },
                path_thumbnail: { type: 'text' },
                path_full: { type: 'text' },
            },
            enabled: false,
        },
        background: {
            type: 'text',
            index: false,
        },
        movies: {
            type: 'nested',
            properties: {
                id: { type: 'integer' },
                name: { type: 'text' },
                thumbnail: { type: 'text' },
                webm: {
                    type: 'object',
                    properties: {
                        '480': { type: 'text' },
                        max: { type: 'text' },
                    },
                },
                highlight: { type: 'boolean' },
            },
            enabled: false,
        },
    },
};
