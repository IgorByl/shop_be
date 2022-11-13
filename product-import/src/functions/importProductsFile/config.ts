import { LambdaConfig } from '@libs/types';
import { SERVICE_NAME, VERSION } from '@constants';

export const importProductsFileConfig: LambdaConfig = {
  events: [
    {
      http: {
        method: 'get',
        path: `/${VERSION}/${SERVICE_NAME}/import`,
        authorizer: {
          arn: '${self:provider.environment.LAMBDA_AUTHORIZER_ARN}',
          type: 'request',
        },
      },
    },
  ],
};
