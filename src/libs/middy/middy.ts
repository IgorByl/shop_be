import { AnyObject, LambdaEventType, LambdaResponseType } from '@libs/types';
import middy from '@middy/core';
import { Handler } from 'aws-lambda';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

export type RequestHandler<T = AnyObject> = (body: T) => AnyObject;
export type ResponseHandler<T = AnyObject> = (response: AnyObject) => T;
export type ErrorHandler<T = AnyObject> = (error: Error) => T;

export const createErrorMiddleware: <T extends AnyObject>(
  errorHandler: ErrorHandler<T>
) => middy.MiddlewareFunction<unknown, T> = (errorHandler) => (request, next) => {
  request.response = errorHandler(request.error);
  next();
};

export const createResponseMiddleware: <T extends AnyObject>(
  responseHandler: ResponseHandler<T>
) => middy.MiddlewareFunction<unknown, T> = (responseHandler) => (request, next) => {
  request.response = responseHandler(request.response);
  next();
};

export const createRequestMiddleware: <T extends AnyObject>(
  requestHandler: RequestHandler<T>
) => middy.MiddlewareFunction<T, unknown> = (requestHandler) => (request, next) => {
  (request.event as AnyObject) = requestHandler(request.event);
  next();
};

/**
 * @param requestHandler handler that pre-processes the AWS event
 * @param responseHandler handler that post-processes the AWS event, should return correct response according to lambda type
 * @param errorHandler handler that process errors, should return correct response according to lambda type
 */
export const buildMiddlewareComposer =
  <T extends Handler>(
    requestHandler: RequestHandler<LambdaEventType<T>>,
    responseHandler: ResponseHandler<LambdaResponseType<T>>,
    errorHandler: ErrorHandler<LambdaResponseType<T>>
  ) =>
  (handler: Handler<LambdaEventType<T>>): typeof handler =>
    middy(handler)
      .use({
        before: createRequestMiddleware(requestHandler),
        after: createResponseMiddleware(responseHandler),
        onError: createErrorMiddleware(errorHandler),
      })
      .use(doNotWaitForEmptyEventLoop({ runOnError: true, runOnAfter: true, runOnBefore: false }));
