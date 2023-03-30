import config from './config';

const swagger_options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Steam-Wiki API',
            version: '1.0.0',
            description: 'API to power Steam-Wiki',
        },
        servers: [
            {
                url: config.server.hostname === 'localhost' ? `http://localhost:${config.server.http_port}` : `https://${config.server.hostname}`,
            },
        ],
    },
    apis: ['*/routes/**/*.ts'],
};

export default swagger_options;
