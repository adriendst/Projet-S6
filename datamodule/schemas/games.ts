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
                autocomplete: {
                    type: 'search_as_you_type',
                },
                fuzzy: {
                    type: 'text',
                    analyzer: 'standard',
                },
                sort: {
                    type: 'keyword',
                },
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
                autocomplete: {
                    type: 'search_as_you_type',
                },
                completion: {
                    type: 'completion',
                },
            },
        },
        publisher: {
            type: 'keyword',
            fields: {
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

export const GAME_SETTINGS: Record<string, any> = {
    analysis: {
        filter: {
            autocomplete_filter: {
                type: 'edge_ngram',
                min_gram: 1,
                max_gram: 10,
            },
        },
        analyzer: {
            autocomplete: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'autocomplete_filter'],
            },
        },
    },
};

export const OTHER_SETTINGS = {
    analysis: {
        analyzer: {
            autocomplete: {
                tokenizer: 'autocomplete',
                filter: ['lowercase'],
            },
        },
        tokenizer: {
            autocomplete: {
                type: 'edge_ngram',
                min_gram: 1,
                max_gram: 20,
                token_chars: ['letter', 'digit'],
            },
        },
    },
};
