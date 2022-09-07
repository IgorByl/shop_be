import {
  BadRequestError,
  ContentValidationError,
  InternalServerError,
  NotFoundError,
  NotFoundResourceError,
} from '@libs/errors';
import { ProductLambda, PathParameters } from 'src/types';

export const getProductLambda: ProductLambda<unknown, unknown, PathParameters> =
  (productService, logger) => async (event, context) => {
    const endpointDetails = `${event.httpMethod} ${event.path}`;
    try {
      logger.setLambdaContext(context);
      logger.info({ Msg: `${endpointDetails}: Get Product lambda invoke` });

      const product = await productService.getProduct(event.pathParameters?.Id);

      return { body: product };
    } catch (error) {
      logger.error({
        Exp: error.message,
        Stack: error.stack,
        Msg: `${endpointDetails}: Get Product lambda error`,
      });

      if (error instanceof ContentValidationError) {
        throw new BadRequestError(`${endpointDetails}: Invalid request.`);
      }

      if (error instanceof NotFoundResourceError) {
        throw new NotFoundError(`${endpointDetails}: The specified resource is not found.`);
      }

      throw new InternalServerError(`${endpointDetails}: Internal server error.`);
    }
  };
