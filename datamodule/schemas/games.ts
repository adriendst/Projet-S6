export const GAME_SCHEMA = {
    properties: {
        appid: { type: 'long' },
        name: {
            type: 'text',
            //analyzer: 'ngram_analyzer',
            fielddata: true
        },
        release_date: {
            type: 'date'
        },
        english: {
            type: 'boolean'
        },
        developer: {
            type: 'text'
        },
        publisher: {
            type: 'text'
        },
        platforms: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                    ignore_above: 256
                }
            }
        },
        required_age: {
            type: 'long'
        },
        categories: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                    ignore_above: 256
                }
            }
        },
        genres: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword'
                }
            }
        },
        steamspy_tags: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword'
                }
            }
        },
        achievements: {
            type: 'long'
        },
        positive_ratings: {
            type: 'long'
        },
        negative_ratings: {
            type: 'long'
        },
        average_playtime: {
            type: 'long'
        },
        median_playtime: {
            type: 'long'
        },
        owners: {
            type: 'text'
        },
        price: {
            type: 'float'
        }
    }
};
