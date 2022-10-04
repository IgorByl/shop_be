import {
  BadRequestError,
  ConflictResourceError,
  ContentValidationError,
  DuplicateResourceError,
  InternalServerError,
} from '@libs/errors';
import { HttpStatusCode } from '@libs/types';
import { ProductLambda, ProductDTO } from 'src/types';

export const createProductLambda: ProductLambda<ProductDTO, unknown, unknown> =
  (productService, logger) => async (event, context) => {
    const endpointDetails = `${event.httpMethod} ${event.path}`;
    try {
      logger.setLambdaContext(context);
      logger.info({ Msg: `${endpointDetails}: Create Product lambda invoke` });

      const product = await productService.createProduct(event.body);

      return { statusCode: HttpStatusCode.CREATED, body: product };
    } catch (error) {
      logger.error({
        Exp: error.message,
        Stack: error.stack,
        Msg: `${endpointDetails}: Create Product lambda error`,
      });

      if (error instanceof ContentValidationError) {
        throw new BadRequestError(`${endpointDetails}: Invalid request.`);
      }

      if (error instanceof DuplicateResourceError) {
        throw new ConflictResourceError(
          `${endpointDetails}: The request could not be completed due to a conflict.`
        );
      }

      throw new InternalServerError(`${endpointDetails}: Internal server error.`);
    }
  };
