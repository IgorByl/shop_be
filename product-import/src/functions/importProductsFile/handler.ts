import { InternalServerError } from '@libs/errors';
import { ImportProductsFileLambda, ImportProductsFileQueryParameters } from 'src/types';

export const importProductsFileLambda: ImportProductsFileLambda<
  unknown,
  ImportProductsFileQueryParameters,
  unknown
> = (dataImportService, logger) => async (event, context) => {
  const endpointDetails = `${event.httpMethod} ${event.path}`;

  try {
    logger.setLambdaContext(context);
    logger.info({ Msg: `${endpointDetails}: Import Products File lambda invoke` });

    const params = event.queryStringParameters;

    const signedUrl = await dataImportService.getBucketSignedUrl(params?.name);

    return { body: { signedUrl } };
  } catch (error) {
    logger.error({
      Exp: error.message,
      Stack: error.stack,
      Msg: `${endpointDetails}: Import Products File lambda error`,
    });

    throw new InternalServerError(`${endpointDetails}: Internal server error.`);
  }
};
