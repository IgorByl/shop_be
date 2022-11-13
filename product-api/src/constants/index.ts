export const APPLICATION_VERSION = 'v1';

export const APPLICATION_REGION = process.env.AWS_REGION;
export const SNS_ARN = process.env.SNS_ARN || '';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const SERVICE_NAME = 'product-api';
export const VERSION = 'v1';
