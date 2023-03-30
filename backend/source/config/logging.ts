import util from 'util';

const log = ({ message, namespace = 'SERVER', object, type = 'INFO' }: { namespace: string; message: string; object?: any; type: string }) => {
    if (object) {
        console.info(`[${getTimeStamp()}] [${type}] [${namespace}] ${message}`, util.inspect(object, { showHidden: false, depth: null, colors: true }));
    } else {
        console.info(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`);
    }
};

const info = (namespace: string, message: string, object?: any) => {
    log({
        namespace,
        message,
        object,
        type: 'INFO',
    });
};

const warn = (namespace: string, message: string, object?: any) => {
    log({
        namespace,
        message,
        object,
        type: 'WARN',
    });
};

const error = (namespace: string, message: string, object?: any) => {
    log({
        namespace,
        message,
        object,
        type: 'ERROR',
    });
};

const debug = (namespace: string, message: string, object?: any) => {
    log({
        namespace,
        message,
        object,
        type: 'DEBUG',
    });
};

const getTimeStamp = (): string => {
    return new Date().toISOString();
};

export default {
    info,
    warn,
    error,
    debug,
};
