export const USER_MAPPINGS = {
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
