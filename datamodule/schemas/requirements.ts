export const REQUIREMENTS_PROPERTIES = {
    appid: {
        type: 'keyword',
    },
    pc_requirements: {
        type: 'object',
        properties: {
            minimum: {
                type: 'text',
            },
            recommended: {
                type: 'text',
            },
        },
    },
    mac_requirements: {
        type: 'object',
        properties: {
            minimum: {
                type: 'text',
            },
            recommended: {
                type: 'text',
            },
        },
    },
    linux_requirements: {
        type: 'object',
        properties: {
            minimum: {
                type: 'text',
            },
            recommended: {
                type: 'text',
            },
        },
    },
    minimum: {
        type: 'text',
    },
    recommended: {
        type: 'text',
        index: false,
    },
};
