import { LambdaLoggerService, LogLevel } from '@libs/logger';
import { applyJsonMiddlewares } from '@libs/middy';
import { importProductsFileLambda } from '@functions/importProductsFile';
import { importFileParserLambda } from '@functions/importFileParser';
import { S3, SQS } from 'aws-sdk';
import { StorageService, DataImportService } from './services';
import { S3_BUCKET_NAME, APPLICATION_REGION } from '@constants';
import { SQSService } from './services/sqs';

const sqsConfig: Partial<SQS.SendMessageRequest> = {
  QueueUrl: process.env.SQS_URL,
  MessageGroupId: process.env.SQS_MESSAGE_GROUP_ID,
};

const sqs = new SQS({
  apiVersion: '2012-11-05',
  region: APPLICATION_REGION,
});

const logger: LambdaLoggerService = new LambdaLoggerService({ logLevel: LogLevel.INFO });

const sqsService = new SQSService(logger, sqs, sqsConfig);

const s3Config: Partial<S3.ClientConfiguration> = {
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
};

const storage = new S3(s3Config);

const storageServiceConfig = {
  storage,
  logger,
  bucketName: S3_BUCKET_NAME,
  sqsService,
};

const storageService = new StorageService(storageServiceConfig);

const dataImportServiceConfig = {
  logger,
  storageService,
};

const dataImportService = new DataImportService(dataImportServiceConfig);

export const importProductsFile = applyJsonMiddlewares(
  importProductsFileLambda(dataImportService, logger),
  logger
);

export const importFileParser = importFileParserLambda(dataImportService, logger);

process.on('unhandledRejection', (error: Error) => {
  logger.error({ Exp: error.message, Stack: error.stack, Msg: 'unhandledRejection' });
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error({ Exp: error.message, Stack: error.stack, Msg: 'uncaughtException' });
  process.exit(1);
});
