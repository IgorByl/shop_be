import { LambdaConfig } from '@libs/types';

export const catalogsProductsConfig: LambdaConfig = {
  events: [
    {
      sqs: {
        arn: {
          "Fn::GetAtt": [ 'ProcessSQS', 'Arn' ],
        },
        batchSize: 5,
      },
    },
  ],
};
