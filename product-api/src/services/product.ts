import { ContentValidationError, NotFoundResourceError } from '@libs/errors';
import { v4 as uuid } from 'uuid';
import { ProductDTO, ProductResult } from 'src/types';
import { Product } from '../entities';
import { mockProducts } from '../__mocks__';

export class ProductService {
  /**
   * Get product record by specified Id
   * @param id uuid
   * @returns Promise<ProductResult>
   */
  async getProduct(id: uuid): Promise<ProductResult> {
    const product = await mockProducts.find((item) => item.id === id);

    if (!product) {
      throw new NotFoundResourceError('The product with specified Id was not found');
    }

    return product;
  }

  /**
   * Get product records
   * @returns Promise<ProductResult[]>
   */
  async getProducts(): Promise<ProductResult[]> {
    return mockProducts;
  }

  /**
   * Create product record
   * @param productDto ProductDTO
   * @returns Promise<ProductResult>
   */
  async createProduct(productDto: ProductDTO): Promise<ProductResult> {
    if (!productDto) {
      throw new ContentValidationError('Product data is invalid');
    }

    const product = await Product.createEntity(productDto);

    return product;
  }
}
