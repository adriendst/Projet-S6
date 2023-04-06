import { ResponseError } from '@elastic/elasticsearch/lib/errors';
import { HTTP_STATUS } from '../../../config/http_status';
import logging from '../../../config/logging';

export const DaoErrorHandler = (error: any, reject: Function, namespace: string = 'ERROR_HANDLER') => {
    if (error instanceof ResponseError) {
        // logging.error(namespace, 'RequestAbortedError', error);
        reject({ code: error.statusCode, message: error.message, cause: error });
    } else {
        reject({ ...HTTP_STATUS.InternaleServerError, cause: error });
    }
};
