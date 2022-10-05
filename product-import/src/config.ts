import { MicroserviceConfig } from '@libs/types';
import { handlerPath } from '@libs/helpers';
import { importProductsFileConfig } from '@functions/importProductsFile';
import { importFileParserConfig } from '@functions/importFileParser';

export const microserviceConfig: MicroserviceConfig = {
  importProductsFile: {
    handler: `${handlerPath(__dirname)}/microservice.importProductsFile`,
    ...importProductsFileConfig,
  },

  importFileParser: {
    handler: `${handlerPath(__dirname)}/microservice.importFileParser`,
    ...importFileParserConfig,
  },
};
