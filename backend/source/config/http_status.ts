export const HTTP_STATUS_CODE = {
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthorativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    RequestTimeout: 408,
    Conflict: 409,
    UnsupportedMediaType: 415,
    UnprocessableEntity: 422,
    InternaleServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
};

export type HTTP_STATUS_TYPE = {
    code: number;
    message: string;
};

export const HTTP_STATUS: {
    [key: string]: HTTP_STATUS_TYPE;
} = {
    Ok: { code: 200, message: 'Ok' },
    Created: { code: 201, message: 'Created' },
    Accepted: { code: 202, message: 'Accepted' },
    NonAuthorativeInformation: { code: 203, message: 'Non Authorative Information' },
    NoContent: { code: 204, message: 'No Content' },
    ResetContent: { code: 205, message: 'Reset Content' },
    PartialContent: { code: 206, message: 'Partial Content' },
    BadRequest: { code: 400, message: 'Bad Request' },
    Unauthorized: { code: 401, message: 'Unauthozized' },
    Forbidden: { code: 403, message: 'Forbidden' },
    NotFound: { code: 404, message: 'Not Found' },
    MethodNotAllowed: { code: 405, message: 'Method Not Allowed' },
    RequestTimeout: { code: 408, message: 'Request Timeout' },
    Conflict: { code: 409, message: 'Conflict' },
    UnsupportedMediaType: { code: 415, message: 'Unsupported Media Type' },
    UnprocessableEntity: { code: 422, message: 'Unprocessable Entity' },
    InternaleServerError: { code: 500, message: 'Internal Server Error' },
    NotImplemented: { code: 501, message: 'Not Implemented' },
    BadGateway: { code: 502, message: 'Bad Gateway' },
};
