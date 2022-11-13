import { ACCESS_TOKEN_COOKIE_NAME } from '../../constants';
import { APIGatewayIAMAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { APIAuthorizerLambda } from '../../types';
import { generateAllow, generateDeny, parseAPIGatewayCookies } from '../../utils';

export const createBasicAuthorizerLambda: APIAuthorizerLambda =
  (authorizationService, logger) =>
  async (
    event: APIGatewayRequestAuthorizerEvent,
    context
  ): Promise<APIGatewayIAMAuthorizerResult> => {
    logger.setLambdaContext(context);
    logger.info({ Msg: 'Basic Authorizer lambda invoke' });

    try {
      const headers = event.headers;

      const parsedCookies = parseAPIGatewayCookies(headers?.cookie ?? (headers?.Cookie as string));

      let token: string;

      if (parsedCookies && parsedCookies[ACCESS_TOKEN_COOKIE_NAME]) {
        token = parsedCookies[ACCESS_TOKEN_COOKIE_NAME];
      } else {
        logger.error({
          Msg: 'No token in Cookie header',
        });
        throw new Error('Unauthorized');
      }

      const tokenData = authorizationService.decodeToken(token);

      if (!tokenData) {
        throw new Error('Token is not valid or can not be decoded properly');
      }

      const isValid = await authorizationService.verifyToken(tokenData);

      return isValid
        ? generateAllow(tokenData, event.methodArn)
        : generateDeny(tokenData, event.methodArn);
    } catch (error) {
      logger.error({
        Exp: error.message,
        Stack: error.stack,
        Msg: error.message,
      });
      throw new Error('Basic Authorizer lambda error');
    }
  };
