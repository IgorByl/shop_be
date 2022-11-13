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
    topicName: 'ihar-bulaty-processTopic',
    queueName: 'ihar-bulaty-processSQS.fifo'
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-central-1',
    profile: 'js-cc4',
    environment: {
      DATABASE_STACK: 'ihar-bulaty-product-database-dev',
      SNS_ARN: {
        "Ref": 'ProcessSNS',
      },
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
        },
        {
          Effect: "Allow",
          Action: ["sqs:*"],
          Resource: {
            "Fn::GetAtt": [ 'ProcessSQS', 'Arn' ],
          }
        },
        {
          Effect: "Allow",
          Action: ["sns:*"],
          Resource: {
            "Ref": 'ProcessSNS',
          }
        }]
      },
    },
  },
  package: { excludeDevDependencies: true },
  functions: microserviceConfig,
  resources: {
    Resources: {
      ProcessSQS: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${self:custom.queueName}',
          FifoQueue: true,
          ContentBasedDeduplication: true,
        },
      },
      ProcessSNS: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: '${self:custom.topicName}',
        }
      }
    },
    Outputs: {
      ProcessSQSArn: {
        Description : "Products catalog queue arn",
        Value: { "Fn::GetAtt" : [ 'ProcessSQS', 'Arn' ] },
        Export: {
          Name: {"Fn::Sub": "${AWS::StackName}-ProcessSQSArn" }
        }
      },
      ProcessSQSUrl: {
        Description : "Products catalog queue url",
        Value: { "Ref" : 'ProcessSQS' },
        Export: {
          Name: {"Fn::Sub": "${AWS::StackName}-ProcessSQSUrl" }
        }
      },
      ProcessSNSArn: {
        Description : "Products catalog topic arn",
        Value: { "Fn::GetAtt" : [ 'ProcessSNS', 'TopicArn' ] },
      }
    }
  }
};

module.exports = serverlessConfiguration;
