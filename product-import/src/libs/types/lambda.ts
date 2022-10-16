import { AWS } from '@serverless/typescript';
import { Handler, APIGatewayProxyEvent } from 'aws-lambda';
import { AnyObject, Property } from './utils';

export type LambdaResponseType<T> = T extends Handler<unknown, infer U> ? U : void;
export type LambdaEventType<T> = T extends Handler<infer U, unknown> ? U : void;

export type MicroserviceConfig = Property<AWS, 'functions'>;
export type LambdaConfig = Property<MicroserviceConfig, 'function'>;

export type LambdaGateway<Body = never, Query = never, Path = never> = Handler<
  APIGatewayProxyEvent & {
    body: Body;
    queryStringParameters: Query;
    pathParameters: Path;
  },
  AnyObject
>;
