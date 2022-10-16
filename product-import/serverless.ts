import type { AWS } from '@serverless/typescript';
import { microserviceConfig } from './src/config';

const serverlessConfiguration: AWS = {
  service: 'ihar-bulaty-product-import',
  frameworkVersion: '3',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceExclude: ['aws-sdk'],
      },
    },
    bucketName: 'ihar-bulaty-shop-products',
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
    environment: {
      S3_BUCKET_NAME: '${self:custom.bucketName}',
    },
    iam: {
      role: {
        permissionsBoundary: 'arn:aws:iam::${aws:accountId}:policy/eo_role_boundary',
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: 'arn:aws:s3:::${self:custom.bucketName}',
          },
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: 'arn:aws:s3:::${self:custom.bucketName}/*',
          },
        ],
      },
    },
  },
  package: { excludeDevDependencies: true },
  functions: microserviceConfig,
  resources: {
    extensions: {
      IamRoleCustomResourcesLambdaExecution: {
        Properties: {
          PermissionsBoundary: 'arn:aws:iam::${aws:accountId}:policy/eo_role_boundary',
        },
      },
    },
    Resources: {
      SourceBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:custom.bucketName}',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
