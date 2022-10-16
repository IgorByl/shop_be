import { Context, SQSBatchResponse, SQSEvent, SQSRecord } from 'aws-lambda';
import { CatalogProductsLambda } from '../../types';

export const catalogProductsLambda: CatalogProductsLambda =
  (notificationService, logger) =>
  async (event: SQSEvent, context: Context): Promise<void | SQSBatchResponse> => {

    try {
      logger.setLambdaContext(context);
      logger.info({ Msg: 'CatalogProducts lambda invokes' });

      await Promise.all(
        event.Records.map(async (record: SQSRecord) => {
          const { body } = record;

          logger.info({
            Msg: `CatalogProducts lambda SQS event body: ${body};`,
          });

          await notificationService.sendNotification(body);
        })
      );
    } catch (error) {
      logger.error({
        Exp: error.message,
        Stack: error.stack,
        Msg: 'CatalogProducts lambda error',
      });
    }
  };
