import { TypeMapping } from '@elastic/elasticsearch/api/types';

export const USER_MAPPINGS: TypeMapping = {
    dynamic: 'strict',
    properties: {
        userid: {
            type: 'keyword',
        },
        email: {
            type: 'keyword',
        },
        password_hash: {
            type: 'text',
            index: false,
        },
        games: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                },
            },
            index: false,
        },
        last_login: {
            type: 'date',
            index: false,
        },
        created_at: {
            type: 'date',
            index: false,
        },
    },
};
