import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_HTTP_PORT = process.env.SERVER_PORT || 9090;
const SERVER_HTTPS_PORT = process.env.HTTPS_SERVER_PORT || 9091;
const SERVER_SECURE = process.env.HTTPS_SECURE || false;
const SERVER_PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const SERVER_CERTIFICATE = process.env.CERTIFICATE || '';
const SERVER_URL = SERVER_HOSTNAME === 'localhost' ? `http://localhost:${SERVER_HTTP_PORT}` : `https://${SERVER_HOSTNAME}`;
const API_VERSION = 'v1';
const API_URL = `${SERVER_URL}/api/${API_VERSION}`;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    http_port: SERVER_HTTP_PORT,
    https_port: SERVER_HTTPS_PORT,
    https_secure: SERVER_SECURE,
    private_key: SERVER_PRIVATE_KEY,
    certificate: SERVER_CERTIFICATE,
    url: SERVER_URL,
    api_url: API_URL,
    api_version: API_VERSION
};

const CORS = {
    origin: ['http://localhost:5173', 'https://admin.salespotter.de'],
    optionsSuccessStatus: 200,
    methods: 'GET, PUT, POST, DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};

const ELASTIC_URL = process.env.ELASTIC_URL || 'http://localhost:9200';

const ELASTIC = {
    url: ELASTIC_URL
};

const ACCESS_TOKEN_EXPIRATION = 30; // in min
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'ACCESSTOKENSECRET';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'REFRESHTOKENSECRET';

const AUTH = {
    access_token_expiration: ACCESS_TOKEN_EXPIRATION,
    access_token_secret: ACCESS_TOKEN_SECRET,
    refresh_token_secret: REFRESH_TOKEN_SECRET
};

export enum MODES {
    DEVELOPMENT,
    PRODUCTION
}

const MODE = process.argv[2] === '-dev' ? MODES.DEVELOPMENT : MODES.PRODUCTION;

const config = {
    server: SERVER,
    auth: AUTH,
    cors: CORS,
    mode: MODE,
    elastic: ELASTIC
};

export default config;
