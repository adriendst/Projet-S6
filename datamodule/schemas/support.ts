import { TypeMapping } from '@elastic/elasticsearch/api/types';

export const SUPPORT_MAPPINGS: TypeMapping = {
    dynamic: 'strict',
    properties: {
        appid: {
            type: 'keyword',
        },
        website: {
            type: 'text',
            index: false,
        },
        support_url: {
            type: 'text',
            index: false,
        },
        support_email: {
            type: 'text',
            index: false,
        },
    },
};
