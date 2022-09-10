import { APPLICATION_REGION, APPLICATION_VERSION, CORS_HEADERS } from '@constants';
import { Logger } from '@libs/logger';
import { HttpStatusCode, isApplicationError, LambdaGateway } from '@libs/types';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildMiddlewareComposer, ErrorHandler, RequestHandler, ResponseHandler } from './middy';

/**
 * @param handler function that receives an AWS Api Gateway event and returns a object
 * @param logger logger instance
 */
export const applyJsonMiddlewares = <Body, Query, Path>(
  handler: LambdaGateway<Body, Query, Path>,
  logger: Logger
): typeof handler =>
  buildMiddlewareComposer(
    createJsonRequestHandler(),
    createJsonResponseHandler(),
    createJsonErrorHandler(logger)
  )(handler);

export const createJsonErrorHandler =
  (logger: Logger): ErrorHandler<APIGatewayProxyResult> =>
  (error) => {
    const statusCode = isApplicationError(error)
      ? error.statusCode
      : HttpStatusCode.INTERNAL_SERVER_ERROR;

    logger.error({ Exp: error.message, Stack: error.stack });

    return {
      statusCode,
      body: JSON.stringify({
        errorMessage: error.message,
      }),
      headers: {
        ...CORS_HEADERS,
        'X-App-Version': APPLICATION_VERSION,
        'X-App-Region': APPLICATION_REGION,
        'Content-Type': 'application/json',
      },
    };
  };

export const createJsonRequestHandler = (): RequestHandler<APIGatewayProxyEvent> => (event) => {
  const { body } = event;

  return { ...event, body: JSON.parse(body) };
};

export const createJsonResponseHandler =
  (): ResponseHandler<APIGatewayProxyResult> =>
  ({ statusCode = HttpStatusCode.OK, body }: { statusCode: HttpStatusCode; body: unknown }) => ({
    statusCode,
    headers: {
      ...CORS_HEADERS,
      'X-App-Version': APPLICATION_VERSION,
      'X-App-Region': APPLICATION_REGION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
