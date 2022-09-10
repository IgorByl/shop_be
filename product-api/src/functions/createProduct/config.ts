import { LambdaConfig } from '@libs/types';
import { SERVICE_NAME, VERSION } from '@constants';

export const createProductConfig: LambdaConfig = {
  events: [
    {
      http: {
        method: 'post',
        path: `/${VERSION}/${SERVICE_NAME}/product`,
      },
    },
  ],
};
