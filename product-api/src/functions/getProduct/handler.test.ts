/* eslint-disable @typescript-eslint/no-explicit-any */
import createEvent from '@serverless/event-mocks';
import { HttpStatusCode } from '@libs/types';
import { ProductService } from '../../services';
import { getProductLambda } from './handler';
import { LambdaLoggerService } from '@libs/logger';
import { ContentValidationError, NotFoundResourceError } from '@libs/errors';
import { ProductResult } from '../../types';

jest.mock('../../services');
jest.mock('@libs/logger');

describe('Get StatusCode lambda', () => {
  let lambda: any;
  let mockedProductService: jest.Mocked<ProductService>;

  beforeEach(() => {
    (ProductService as any).mockClear();
    (LambdaLoggerService as any).mockClear();

    lambda = getProductLambda(new ProductService(), new LambdaLoggerService(null));

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

  it('should return product if no errors', async () => {
    const apiGatewayEvent = createEvent('aws:apiGateway', {
      httpMethod: 'GET',
      pathParameters: { Id: '68eb8278-348e-4948-96b1-674b8d076404' },
    } as any);

    const testProduct: ProductResult = {
      id: '68eb8278-348e-4948-96b1-674b8d076404',
      description: null,
      price: 11,
      title: 'test',
    };

    mockedProductService.getProduct.mockResolvedValue(testProduct);

    const { body } = await lambda(apiGatewayEvent);

    expect(body).toEqual(testProduct);
  });

  it('should return error 400 if Id validation error occurs', async () => {
    expect.assertions(2);
    mockedProductService.getProduct.mockRejectedValue(new ContentValidationError('error'));

    const apiGatewayEvent = createEvent('aws:apiGateway', {
      httpMethod: 'GET',
      pathParameters: { Id: '68eb8278-348e-4948-96b1-674b8d076404' },
    } as any);

    try {
      await lambda(apiGatewayEvent);
    } catch (result) {
      expect(result.statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(result.message).toContain('[BAD_REQUEST]');
    }
  });

  it('should return error 404 if product with specified Id was not found', async () => {
    expect.assertions(2);
    mockedProductService.getProduct.mockRejectedValue(new NotFoundResourceError('error'));

    const apiGatewayEvent = createEvent('aws:apiGateway', {
      httpMethod: 'GET',
      pathParameters: { Id: '68eb8278-348e-4948-96b1-674b8d076404' },
    } as any);

    try {
      await lambda(apiGatewayEvent);
    } catch (result) {
      expect(result.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
      expect(result.message).toContain('[NOT_FOUND]');
    }
  });

  it('should return error 500 if general error occurs', async () => {
    expect.assertions(2);
    mockedProductService.getProduct.mockRejectedValue(new Error());

    const apiGatewayEvent = createEvent('aws:apiGateway', {
      httpMethod: 'GET',
      pathParameters: { Id: '68eb8278-348e-4948-96b1-674b8d076404' },
    } as any);

    try {
      await lambda(apiGatewayEvent);
    } catch (result) {
      expect(result.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(result.message).toContain('[INTERNAL_SERVER_ERROR]');
    }
  });
});
