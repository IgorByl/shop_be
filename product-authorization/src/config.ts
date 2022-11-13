import { basicAuthorizerConfig } from '@functions/basicAuthorizer';
import { handlerPath } from '@libs/handler-resolver';
import { MicroserviceConfig } from './types';

const defaultRuntimeParameters = {
  memorySize: 1024,
  timeout: 20,
};

export const microserviceConfig: MicroserviceConfig = {
  basicAuthorizer: {
    ...defaultRuntimeParameters,
    ...basicAuthorizerConfig,
    handler: `${handlerPath(__dirname)}/microservice.basicAuthorizerLambda`,
    name: 'ihar-bulaty-product-authorization-basicAuthorizer',
  },
};
