import { ProductService } from '../services';
import { LambdaLoggerService } from '@libs/logger';
import { LambdaGateway } from '@libs/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

export interface ProductDTO {
  id?: uuid;
  description?: string;
  price: number;
  title: string;
  count: number;
}

export type ProductResult = Required<ProductDTO>;

export type ProductLambda<T, K, R> = (
  statusCodeService: ProductService,
  logger: LambdaLoggerService
) => LambdaGateway<T, K, R>;

export type APIGatewayEvent<T> = APIGatewayProxyEvent & {
  body: T;
};

export type PathParameters = { Id: string };
