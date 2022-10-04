import { LambdaLoggerService, LogLevel } from '@libs/logger';
import { applyJsonMiddlewares } from '@libs/middy';
import { ProductService } from './services';

/** StatusCodes scope */
import { createProductLambda } from '@functions/createProduct';
import { getProductLambda } from '@functions/getProduct';
import { getProductsLambda } from '@functions/getProducts';

const logger = new LambdaLoggerService({ logLevel: LogLevel.INFO });

const productService = new ProductService();

/** Products **/
export const createProduct = applyJsonMiddlewares(
  createProductLambda(productService, logger),
  logger
);

export const getProduct = applyJsonMiddlewares(getProductLambda(productService, logger), logger);

export const getProducts = applyJsonMiddlewares(getProductsLambda(productService, logger), logger);

process.on('unhandledRejection', (error: Error) => {
  logger.error({ Exp: error.message, Stack: error.stack, Msg: 'unhandledRejection' });
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error({ Exp: error.message, Stack: error.stack, Msg: 'uncaughtException' });
  process.exit(1);
});
