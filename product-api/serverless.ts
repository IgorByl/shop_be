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
    environment: {
      DATABASE_STACK: 'ihar-bulaty-product-database-dev'
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        permissionsBoundary: 'arn:aws:iam::${aws:accountId}:policy/eo_role_boundary',
        statements: [{
          Effect: 'Allow',
          Action: ['dynamodb:Query', 'dynamodb:Scan', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
          Resource: {
            "Fn::ImportValue": '${self:provider.environment.DATABASE_STACK}',
          }
        }]
      },
    },
  },
  package: { excludeDevDependencies: true },
  functions: microserviceConfig,
};

module.exports = serverlessConfiguration;
