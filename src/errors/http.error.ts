export class HttpError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string = "Not Found") {
        super(404, message);
    }
}

export class Duplicated extends HttpError {
    constructor(message: string = "Duplicated") {
        super(409, message);
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string = "Bad Request") {
        super(400, message);
    }
}

export class Forbidden extends HttpError {
    constructor(message: string = "Forbidden") {
        super(403, message);
    }
}

export class Unauthorized extends HttpError {
    constructor(message: string = "Unauthorized") {
        super(401, message);
    }
}
