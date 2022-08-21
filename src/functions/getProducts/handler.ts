import { BadRequestError, ContentValidationError, InternalServerError } from '@libs/errors';
import { ProductLambda } from 'src/types';

export const getProductsLambda: ProductLambda<unknown, unknown, unknown> =
  (productService, logger) => async (event, context) => {
    const endpointDetails = `${event.httpMethod} ${event.path}`;
    try {
      logger.setLambdaContext(context);
      logger.info({ Msg: `${endpointDetails}: Get Products lambda invoke` });

      const products = await productService.getProducts();

      return { body: { Data: products } };
    } catch (error) {
      logger.error({
        Exp: error.message,
        Stack: error.stack,
        Msg: `${endpointDetails}: Get Products lambda error`,
      });

      if (error instanceof ContentValidationError) {
        throw new BadRequestError(`${endpointDetails}: Invalid request.`);
      }

      throw new InternalServerError(`${endpointDetails}: Internal server error.`);
    }
  };
