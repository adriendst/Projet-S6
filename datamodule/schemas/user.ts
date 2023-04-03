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
            enabled: false,
        },
        games: {
            type: 'keyword',
        },
        last_login: {
            type: 'date',
            enabled: false,
        },
        created_at: {
            type: 'date',
            enabled: false,
        },
    },
};
