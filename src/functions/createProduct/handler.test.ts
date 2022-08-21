/* eslint-disable @typescript-eslint/no-explicit-any */
import createEvent from '@serverless/event-mocks';
import { HttpStatusCode } from '@libs/types';
import { ProductService } from '../../services';
import { createProductLambda } from './handler';
import { LambdaLoggerService } from '@libs/logger';
import { ContentValidationError, DuplicateResourceError } from '@libs/errors';
import { ProductDTO, ProductResult } from '../../types';

jest.mock('../../services');
jest.mock('@libs/logger');

describe('Create Product lambda', () => {
  let lambda: any;
  let mockedProductService: jest.Mocked<ProductService>;

  beforeEach(() => {
    (ProductService as any).mockClear();
    (LambdaLoggerService as any).mockClear();

    lambda = createProductLambda(new ProductService(), new LambdaLoggerService(null));

    [mockedProductService] = (ProductService as any).mock.instances;
  });

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, 1, 1));
  });

  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const requestBody: ProductDTO = {
    price: 13,
    title: 'test',
  };

  const apiGatewayEvent = createEvent('aws:apiGateway', {
    httpMethod: 'POST',
    body: requestBody,
  } as any);

  it('should return a new product if no errors', async () => {
    const expectedResponse: ProductResult = {
      ...requestBody,
      id: '68eb8278-348e-4948-96b1-674b8d076404',
      description: null,
    };
    mockedProductService.createProduct.mockResolvedValue(Promise.resolve(expectedResponse));

    const result = await lambda(apiGatewayEvent);

    expect(result.statusCode).toBe(HttpStatusCode.CREATED);
    expect(result.body).toEqual(expectedResponse);
  });

  it('should return error 500 if general error occurs', async () => {
    expect.assertions(2);

    mockedProductService.createProduct.mockImplementation(() => {
      throw new Error('error');
    });

    try {
      await lambda(apiGatewayEvent);
    } catch (result) {
      expect(result.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(result.message).toContain('[INTERNAL_SERVER_ERROR]');
    }
  });

  it('should return error 400 if product validation error occurs', async () => {
    expect.assertions(2);

    mockedProductService.createProduct.mockImplementation(() => {
      throw new ContentValidationError('Some error');
    });

    try {
      await lambda(apiGatewayEvent);
    } catch (result) {
      expect(result.statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(result.message).toContain('[BAD_REQUEST]');
    }
  });

  it('should return error 409 if product with specified id is already created', async () => {
    expect.assertions(2);

    mockedProductService.createProduct.mockImplementation(() => {
      throw new DuplicateResourceError('Some error');
    });

    try {
      await lambda(apiGatewayEvent);
    } catch (result) {
      expect(result.statusCode).toEqual(HttpStatusCode.CONFLICT);
      expect(result.message).toContain('[CONFLICT]');
    }
  });
});
