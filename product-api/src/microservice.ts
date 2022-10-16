import { LambdaLoggerService, LogLevel } from '@libs/logger';
import { applyJsonMiddlewares } from '@libs/middy';
import { NotificationService, ProductService } from './services';

/** StatusCodes scope */
import { createProductLambda } from '@functions/createProduct';
import { getProductLambda } from '@functions/getProduct';
import { getProductsLambda } from '@functions/getProducts';
import { SNS } from 'aws-sdk';
import { APPLICATION_REGION, SNS_ARN } from '@constants';
import { catalogProductsLambda } from './functions/catalogProducts';

const logger = new LambdaLoggerService({ logLevel: LogLevel.INFO });

const productService = new ProductService();

const snsSettings: SNS.Types.ClientConfiguration = {
  region: APPLICATION_REGION,
};

const sns = new SNS(snsSettings);
const snsTopicArn = SNS_ARN;

const notificationService = new NotificationService(sns, snsTopicArn, logger);

/** Products **/
export const createProduct = applyJsonMiddlewares(
  createProductLambda(productService, logger),
  logger
);

export const getProduct = applyJsonMiddlewares(getProductLambda(productService, logger), logger);

export const getProducts = applyJsonMiddlewares(getProductsLambda(productService, logger), logger);

export const catalogProducts = applyJsonMiddlewares(
  catalogProductsLambda(notificationService, logger),
  logger
);

process.on('unhandledRejection', (error: Error) => {
  logger.error({ Exp: error.message, Stack: error.stack, Msg: 'unhandledRejection' });
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error({ Exp: error.message, Stack: error.stack, Msg: 'uncaughtException' });
  process.exit(1);
});
