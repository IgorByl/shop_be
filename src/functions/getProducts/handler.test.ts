/* eslint-disable @typescript-eslint/no-explicit-any */
import createEvent from '@serverless/event-mocks';
import { HttpStatusCode } from '@libs/types';
import { ProductService } from '../../services';
import { getProductsLambda } from './handler';
import { LambdaLoggerService } from '@libs/logger';
import { ProductResult } from '../../types';

jest.mock('../../services');
jest.mock('@libs/logger');

describe('Get Products lambda', () => {
  let lambda: any;
  let mockedProductService: jest.Mocked<ProductService>;

  beforeEach(() => {
    (ProductService as any).mockClear();
    (LambdaLoggerService as any).mockClear();

    lambda = getProductsLambda(new ProductService(), new LambdaLoggerService(null));

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

  it('should return products if no errors', async () => {
    const apiGatewayEvent = createEvent('aws:apiGateway', {
      httpMethod: 'GET',
    } as any);

    const product: ProductResult = {
      id: '68eb8278-348e-4948-96b1-674b8d076404',
      description: null,
      price: 11,
      title: 'test',
    };

    mockedProductService.getProducts.mockResolvedValue([product]);

    const { body } = await lambda(apiGatewayEvent);

    expect(body.Data).toEqual([product]);
  });

  it('should return error 500 if general error occurs', async () => {
    expect.assertions(2);

    const apiGatewayEvent = createEvent('aws:apiGateway', {
      httpMethod: 'GET',
    } as any);

    mockedProductService.getProducts.mockRejectedValue(new Error());

    try {
      await lambda(apiGatewayEvent);
    } catch (result) {
      expect(result.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(result.message).toContain('[INTERNAL_SERVER_ERROR]');
    }
  });
});
