import { ServiceError } from '@libs/errors';
import { Logger } from '@libs/logger';
import { AWSError, Request, S3 } from 'aws-sdk';
import { StorageServiceConfig, FileStorage } from '../types';
import csv from 'csv-parser';
import { SQSService } from './sqs';

export class StorageService implements FileStorage {
  private readonly _s3: S3;
  private readonly _bucketName: string;
  private readonly _logger: Logger;
  private readonly _sqsService: SQSService;

  constructor(config: StorageServiceConfig) {
    this._s3 = config.storage;
    this._logger = config.logger;
    this._bucketName = config.bucketName;
    this._sqsService = config.sqsService;
  }

  /**
   * Parse object from s3
   * @param object Request<S3.GetObjectOutput, AWSError>
   * @param fileKey string
   * @returns Promise<void>
   */
  async parseObject(object: Request<S3.GetObjectOutput, AWSError>, fileKey: string): Promise<void> {
    this._logger.info({
      Msg: `Parsing of the file ${fileKey}`,
    });

    try {
      await object
        .createReadStream()
        .pipe(csv())
        .on('data', async (data) => {
          this._logger.info({
            Msg: `${JSON.stringify(data)}`,
          });

          await this._sqsService.sendMessage(data);
        })
        .on('end', () => {
          this._logger.info({
            Msg: `Parsing of the file ${fileKey} is completed`,
          });
        });
    } catch (error) {
      throw new ServiceError(`Parsing of the file ${fileKey} is failed: ${error}`);
    }
  }

  /**
   * Get Object from s3
   * @param fileKey key of s3 file
   * @returns Request<S3.GetObjectOutput, AWSError>
   */
  getObject(fileKey: string): Request<S3.GetObjectOutput, AWSError> {
    this._logger.info({
      Msg: `Reading from the file: ${fileKey}`,
    });

    try {
      const object = this._s3.getObject({
        Bucket: this._bucketName,
        Key: fileKey,
      });

      return object;
    } catch (error) {
      throw new ServiceError(`Reading from the file ${fileKey} is failed: ${error}`);
    }
  }

  /**
   * Copy Object from s3
   * @param fileKey key of s3 file
   * @returns Promise<void>
   */
  async copyObject(fileKey: string): Promise<void> {
    this._logger.info({
      Msg: `Copy from the file: ${fileKey}`,
    });

    try {
      await this._s3
        .copyObject({
          Bucket: this._bucketName,
          CopySource: `${this._bucketName}/${fileKey}`,
          Key: fileKey.replace('uploaded', 'parsed'),
        })
        .promise();
    } catch (error) {
      throw new ServiceError(`Copy from the file ${fileKey} is failed: ${error}`);
    }
  }

  /**
   * Delete Object from s3
   * @param fileKey key of s3 file
   * @returns Promise<void>
   */
  async deleteObject(fileKey: string): Promise<void> {
    this._logger.info({
      Msg: `Delete the file: ${fileKey}`,
    });

    try {
      await this._s3
        .deleteObject({
          Bucket: this._bucketName,
          Key: fileKey,
        })
        .promise();
    } catch (error) {
      throw new ServiceError(`Delete the file ${fileKey} is failed: ${error}`);
    }
  }

  /**
   * Create signed url for data load
   * @param filePath key of s3 file upload
   * @returns Promise<string>
   */
  async getSignedUrl(filePath: string): Promise<string> {
    this._logger.info({
      Msg: `Generating signed url to the file: ${filePath}`,
    });

    try {
      const signedURL = await this._s3.getSignedUrlPromise('putObject', {
        Bucket: this._bucketName,
        Key: filePath,
        Expires: 120,
        ContentType: 'text/csv',
      });

      return signedURL;
    } catch (error) {
      throw new ServiceError(`Generating signed url to the file ${filePath} is failed: ${error}`);
    }
  }
}
