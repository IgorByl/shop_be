import { LambdaLoggerService, LogLevel } from '@libs/logger';
import { createBasicAuthorizerLambda } from '@functions/basicAuthorizer';
import { AuthorizationService } from './services/authorization';
import { ACCESS_TOKEN_COOKIE_VALUE } from './constants';

const logger = new LambdaLoggerService({ logLevel: LogLevel.INFO });

const authConfig = {
  cookie: ACCESS_TOKEN_COOKIE_VALUE,
};

const authorizationService = new AuthorizationService(authConfig);

export const basicAuthorizerLambda = createBasicAuthorizerLambda(authorizationService, logger);
