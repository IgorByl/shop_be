import { LambdaLoggerService } from '@libs/logger';
import { AWSError, Request, SQS } from 'aws-sdk';
import { ServiceError } from '@libs/errors';

export class SQSService {
  private readonly _logger: LambdaLoggerService;
  private readonly _sqs: SQS;
  private readonly _config: Partial<SQS.SendMessageRequest>;

  constructor(logger: LambdaLoggerService, sqs: SQS, config: Partial<SQS.SendMessageRequest>) {
    this._logger = logger;
    this._sqs = sqs;
    this._config = config;
  }

  async sendMessage(data: any): Promise<Request<SQS.Types.SendMessageResult, AWSError>> {
    const message = JSON.stringify({ data });

    let result;

    try {
      result = await this._sqs
        .sendMessage({
          QueueUrl: this._config.QueueUrl,
          MessageBody: message,
          MessageGroupId: this._config.MessageGroupId, // FIFO
        } as SQS.Types.SendMessageRequest)
        .promise();

      this._logger.info({
        Msg: `Message is successfully sent to SQS service."`,
      });

      return result;
    } catch (error) {
      throw new ServiceError(`Error occurred during publishing message to SQS: ${error.message}`);
    }
  }
}
