import { S3Handler, S3Event } from 'aws-lambda';
import { InternalServerError } from '@libs/errors';

export const importFileParserLambda: any =
  (dataImportService, logger): S3Handler =>
  async (event: S3Event, _context) => {
    try {
      logger.info({ Msg: `Import Products File lambda invoke` });

      for await (const record of event.Records) {
        const objectKey = record.s3?.object?.key;

        await dataImportService.parseFile(objectKey);
      }
    } catch (error) {
      logger.error({
        Exp: error.message,
        Stack: error.stack,
        Msg: 'Import Products File lambda error',
      });

      throw new InternalServerError(`Internal server error.`);
    }
  };
