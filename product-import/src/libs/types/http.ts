export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export interface HttpError {
  get message(): string;
  get statusCode(): HttpStatusCode;
}

export const isApplicationError = (applicationError: unknown): applicationError is HttpError =>
  (applicationError as HttpError).message !== undefined &&
  (applicationError as HttpError).statusCode !== undefined;
