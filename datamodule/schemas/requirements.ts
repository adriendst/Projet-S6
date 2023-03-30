import { TypeMapping } from '@elastic/elasticsearch/api/types';

export const REQUIREMENTS_MAPPINGS: TypeMapping = {
    dynamic: 'strict',
    properties: {
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
            enabled: false,
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
            enabled: false,
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
            enabled: false,
        },
        minimum: {
            type: 'text',
            index: false,
        },
        recommended: {
            type: 'text',
            index: false,
        },
    },
};
