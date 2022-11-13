import { LambdaLoggerService } from '@libs/logger';
import { LambdaGateway } from '@libs/types';
import { S3Handler } from 'aws-lambda';
import { S3, Request, AWSError } from 'aws-sdk';
import { StorageService, DataImportService, SQSService } from '../services';

export type ImportProductsFileLambda<T, K, R> = (
  dataImportService: DataImportService,
  logger: LambdaLoggerService
) => LambdaGateway<T, K, R>;

export type ImportProductsFileQueryParameters = {
  name: string;
};

export interface FileStorage {
  copyObject(fileKey: string): Promise<void>;
  deleteObject(fileKey: string): Promise<void>;
  getObject(fileKey: string): Request<S3.GetObjectOutput, AWSError>;
  parseObject(object: Request<S3.GetObjectOutput, AWSError>, fileKey: string): Promise<void>;
}

export interface StorageServiceConfig {
  logger: LambdaLoggerService;
  storage: S3;
  bucketName: string;
  sqsService: SQSService;
}

export interface DataImportServiceConfig {
  logger: LambdaLoggerService;
  storageService: StorageService;
}

export type FileParserLambda = (
  dataImportService: DataImportService,
  logger: LambdaLoggerService
) => S3Handler;
