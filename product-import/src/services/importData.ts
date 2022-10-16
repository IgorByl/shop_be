import { DataImportServiceConfig } from '../types';
import { LambdaLoggerService } from '@libs/logger';
import { StorageService } from './storage';

export class DataImportService {
  private readonly _logger: LambdaLoggerService;
  private readonly _storageService: StorageService;

  constructor(config: DataImportServiceConfig) {
    this._logger = config.logger;
    this._storageService = config.storageService;
  }

  async getBucketSignedUrl(fileName: string): Promise<string> {
    const filePath = `uploaded/${fileName}`;
    const putUrl = this._storageService.getSignedUrl(filePath);

    return putUrl;
  }

  async parseFile(objectKey: string): Promise<void> {
    const object = this._storageService.getObject(objectKey);
    await this._storageService.parseObject(object, objectKey);
    await this._storageService.copyObject(objectKey);
    await this._storageService.deleteObject(objectKey);
  }
}
