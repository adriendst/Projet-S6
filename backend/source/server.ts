import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logging';
import config, { MODES } from './config/config';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swagger_options from './config/swagger';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { exit } from 'process';
import { HTTP_STATUS, HTTP_STATUS_CODE } from './config/http_status';

import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import developerRoutes from './routes/delveoper';
import categoryRoutes from './routes/category';
import genreRoutes from './routes/genre';

const NAMESPACE = 'Server';
const isProdMode = config.mode === MODES.PRODUCTION;

const specs = swaggerJSDoc(swagger_options);

const app = express();

app.use('/doc', swaggerUI.serve, swaggerUI.setup(specs));

if (isProdMode) {
    app.use(cors(config.cors));

    app.enable('trust proxy');
    app.use((req, res, next) => {
        if (!req.secure) {
            return res.redirect(`https://${config.server.hostname}:${config.server.https_port}${req.url}`);
        }
        next();
    });

    app.use((req, res, next) => {
        if (!req.headers?.['user-agent']) {
            res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Its seems that you are not using a browser...' });
            return;
        }
        if (!req.headers['user-agent'].startsWith('Mozilla')) {
            res.status(HTTP_STATUS_CODE.Unauthorized).json({ message: 'Its seems that you are not using a browser...' });
            return;
        }
        next();
    });
} else {
    app.use(cors());
}

/** Parse the body of the request */
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

/** Log the request */
app.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Routes go here */
app.use(`/${config.server.api_version}/auth`, authRoutes);
app.use(`/${config.server.api_version}/game`, gameRoutes);
app.use(`/${config.server.api_version}/developer`, developerRoutes);
app.use(`/${config.server.api_version}/category`, categoryRoutes);
app.use(`/${config.server.api_version}/genre`, genreRoutes);

/** Error handling */
app.use((_req, res, _next) => {
    res.status(HTTP_STATUS_CODE.NotFound).json({ error: HTTP_STATUS.NotFound.message });
});

app.disable('x-powered-by');

const httpServer = http.createServer(app);
httpServer.listen(config.server.http_port, () =>
    logging.info(NAMESPACE, `Server is running on http://${config.server.hostname}${isProdMode ? '' : ':' + config.server.http_port} in ${isProdMode ? 'prodcution' : 'development'}-mode`),
);

if (isProdMode) {
    try {
        const httpsServer = https.createServer(
            {
                key: fs.readFileSync(config.server.private_key, 'utf8'),
                cert: fs.readFileSync(config.server.certificate, 'utf8'),
            },
            app,
        );
        httpsServer.listen(config.server.https_port, () => logging.info(NAMESPACE, `Server is running on https://${config.server.hostname}`));
    } catch (e: any) {
        console.error('Could not find SSL-certificates!');
        exit();
    }
}
