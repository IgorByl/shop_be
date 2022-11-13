import { LambdaLogger } from '@libs/logger';
import { AWS } from '@serverless/typescript';
import { APIGatewayRequestAuthorizerHandler } from 'aws-lambda';
import { AuthorizationService } from '../services/authorization';

export type Property<T, U extends keyof T> = T[U];
export type MicroserviceConfig = Property<AWS, 'functions'>;
export type LambdaConfig = Property<MicroserviceConfig, 'function'>;

export type APIAuthorizerLambda = (
  authorizationService: AuthorizationService,
  logger: LambdaLogger
) => APIGatewayRequestAuthorizerHandler;
