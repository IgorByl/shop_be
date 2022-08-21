import type { AWS } from '@serverless/typescript';
import { microserviceConfig } from './src/config';

const serverlessConfiguration: AWS = {
  service: 'ihar-bulaty-product-api',
  frameworkVersion: '3',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceExclude: ['aws-sdk'],
      },
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-central-1',
    profile: 'js-cc4',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: 'arn:aws:iam::398158581759:role/BasicLambdaExecutionRole',
    },
  },
  package: { individually: true },
  functions: microserviceConfig,
};

module.exports = serverlessConfiguration;
