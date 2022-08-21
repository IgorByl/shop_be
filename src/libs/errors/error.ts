import { HttpError, HttpStatusCode } from '@libs/types';

export class InternalServerError extends Error implements HttpError {
  constructor(private readonly _message: string) {
    super();
  }

  get message(): string {
    return `[INTERNAL_SERVER_ERROR] ${this._message}`;
  }

  get statusCode(): HttpStatusCode {
    return HttpStatusCode.INTERNAL_SERVER_ERROR;
  }
}

export class BadRequestError extends Error implements HttpError {
  constructor(private readonly _message: string) {
    super();
  }

  get message(): string {
    return `[BAD_REQUEST] ${this._message}`;
  }

  get statusCode(): HttpStatusCode {
    return HttpStatusCode.BAD_REQUEST;
  }
}

export class ServiceUnavailableError extends Error implements HttpError {
  constructor(private readonly _message: string) {
    super();
  }

  get message(): string {
    return `[SERVICE_UNAVAILABLE] ${this._message}`;
  }

  get statusCode(): HttpStatusCode {
    return HttpStatusCode.SERVICE_UNAVAILABLE;
  }
}

export class NotFoundError extends Error implements HttpError {
  constructor(private readonly _message?: string) {
    super();
  }

  get message(): string {
    return `[NOT_FOUND] ${this._message ? this._message : 'The specified resource is not found'}`;
  }

  get statusCode(): HttpStatusCode {
    return HttpStatusCode.NOT_FOUND;
  }
}

export class ConflictResourceError extends Error implements HttpError {
  constructor(private readonly _message: string) {
    super();
  }

  get message(): string {
    return `[CONFLICT] ${this._message}`;
  }

  get statusCode(): HttpStatusCode {
    return HttpStatusCode.CONFLICT;
  }
}

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DuplicateResourceError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundResourceError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
