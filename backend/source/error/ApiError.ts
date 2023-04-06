import { HTTP_STATUS_TYPE } from '../config/http_status';

export class APIError {
    code: number;
    message: string;
    cause: any;

    constructor(code: number, message: string, cause: any) {
        this.code = code;
        this.message = message;
        this.cause = cause;
    }

    static withStatus(status: HTTP_STATUS_TYPE, cause: any): APIError {
        return new APIError(status.code, status.message, cause);
    }
}
