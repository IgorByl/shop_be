import { LambdaLoggerService } from '@libs/logger';
import { SNS } from 'aws-sdk';

export class NotificationService {
  constructor(
    private readonly _sns: SNS,
    private readonly _topicArn: string,
    private readonly _logger: LambdaLoggerService
  ) {}

  async sendNotification(message: string): Promise<void> {
    try {
      this._logger.info({
        Msg: `Sending the message with product: ${message}`,
      });

      const {
        $response: { error },
      } = await this._sns
        .publish({
          Message: message,
          Subject: 'Product import',
          TopicArn: this._topicArn,
        })
        .promise();

      if (error) {
        throw error;
      }
    } catch (error) {
      this._logger.info({
        Msg: `Sending the message with product: ${message} is failed with error 
          ${(error as Error).message} 
          ${(error as Error).stack}`,
      });
    }
  }
}
