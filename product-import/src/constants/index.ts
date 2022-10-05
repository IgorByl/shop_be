export const APPLICATION_VERSION = 'v1';

export const APPLICATION_REGION = process.env.AWS_REGION;

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const SERVICE_NAME = 'product-import';
export const VERSION = 'v1';

export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'ihar-bulaty-shop-products';
