import { LambdaConfig } from '@libs/types';
import { SERVICE_NAME, VERSION } from '@constants';

export const getProductsConfig: LambdaConfig = {
  events: [
    {
      http: {
        method: 'get',
        path: `/${VERSION}/${SERVICE_NAME}/product`,
      },
    },
  ],
};
