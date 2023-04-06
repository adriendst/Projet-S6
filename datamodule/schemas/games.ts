import { TypeMapping } from '@elastic/elasticsearch/api/types';

export const GAME_MAPPINGS: TypeMapping = {
    dynamic: 'strict',
    properties: {
        appid: {
            type: 'keyword',
        },
        name: {
            type: 'text',
            fields: {
                fuzzy: {
                    type: 'text',
                    analyzer: 'stop',
                },
                autocomplete: {
                    type: 'search_as_you_type',
                },
                keyword: {
                    type: 'keyword',
                },
                // completion: {
                //     type: 'completion',
                // },
            },
        },
        release_date: {
            type: 'date',
        },
        english: {
            type: 'boolean',
            index: false,
        },
        developer: {
            type: 'keyword',
            fields: {
                fuzzy: {
                    type: 'text',
                    analyzer: 'standard',
                },
                autocomplete: {
                    type: 'search_as_you_type',
                },
            },
        },
        publisher: {
            type: 'keyword',
            fields: {
                fuzzy: {
                    type: 'text',
                    analyzer: 'standard',
                },
                autocomplete: {
                    type: 'search_as_you_type',
                },
            },
        },
        platforms: {
            type: 'keyword',
        },
        required_age: {
            type: 'integer',
        },
        categories: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                },
            },
        },
        genres: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                },
            },
        },
        steamspy_tags: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                },
            },
        },
        achievements: {
            type: 'long',
            index: false,
        },
        positive_ratings: {
            type: 'long',
            index: false,
        },
        negative_ratings: {
            type: 'long',
            index: false,
        },
        average_playtime: {
            type: 'long',
            index: false,
        },
        median_playtime: {
            type: 'long',
            index: false,
        },
        owners: {
            type: 'text',
            index: false,
        },
        price: {
            type: 'float',
        },
    },
};
