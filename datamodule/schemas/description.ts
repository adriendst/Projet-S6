import { TypeMapping } from '@elastic/elasticsearch/api/types';

export const DESCRIPTION_MAPPINGS: TypeMapping = {
    dynamic: 'strict',
    properties: {
        appid: {
            type: 'keyword',
        },
        detailed_description: {
            type: 'text',
            index: false,
        },
        about_the_game: {
            type: 'text',
            index: false,
        },
        short_description: {
            type: 'text',
            index: false,
        },
    },
};
