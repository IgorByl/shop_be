import { MicroserviceConfig } from '@libs/types';
import { handlerPath } from '@libs/helpers';

/** Products' configs */
import { getProductConfig } from '@functions/getProduct';
import { getProductsConfig } from '@functions/getProducts';
import { createProductConfig } from '@functions/createProduct';
import { catalogsProductsConfig } from '@functions/catalogProducts'

export const microserviceConfig: MicroserviceConfig = {
  /** Products' scope */

  getProduct: {
    handler: `${handlerPath(__dirname)}/microservice.getProduct`,
    ...getProductConfig,
  },

  getProducts: {
    handler: `${handlerPath(__dirname)}/microservice.getProducts`,
    ...getProductsConfig,
  },

  createProduct: {
    handler: `${handlerPath(__dirname)}/microservice.createProduct`,
    ...createProductConfig,
  },

  catalogProducts: {
    handler: `${handlerPath(__dirname)}/microservice.catalogProducts`,
    ...catalogsProductsConfig,
  }
};
