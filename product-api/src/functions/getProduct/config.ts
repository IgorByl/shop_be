import { LambdaConfig } from '@libs/types';
import { SERVICE_NAME, VERSION } from '@constants';

export const getProductConfig: LambdaConfig = {
  events: [
    {
      http: {
        method: 'get',
        path: `/${VERSION}/${SERVICE_NAME}/product/{Id}`,
        request: {
          parameters: {
            paths: {
              Id: true,
            },
          },
        },
      },
    },
  ],
};
