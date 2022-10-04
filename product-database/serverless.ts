import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'ihar-bulaty-product-database',
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-central-1',
    profile: 'js-cc4',
  },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:service}-${self:provider.stage}',
          AttributeDefinitions: [{
            AttributeName: 'id',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'id',
            KeyType: 'HASH'
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      }
    },
    Outputs: {
      ProductsTable: {
        Description : "The arn of the database cloudfront instance",
        Value: { "Fn::GetAtt" : [ 'ProductsTable', 'Arn' ] },
        Export: {
          Name: {"Fn::Sub": "${AWS::StackName}" }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
