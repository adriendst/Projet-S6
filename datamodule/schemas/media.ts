export const MEDIA_PROPERTIES = {
    appid: {
        type: 'keyword',
    },
    header_image: {
        type: 'text',
    },
    screenshots: {
        type: 'nested',
        properties: {
            id: { type: 'integer' },
            path_thumbnail: { type: 'text' },
            path_full: { type: 'text' },
        },
    },
    background: {
        type: 'text',
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
    },
};
