import { Column, Entity, PrimaryColumn } from 'typeorm';
import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  Length,
  validateOrReject,
  IsOptional,
} from 'class-validator';
import { ProductDTO } from '../types';
import { ContentValidationError } from '@libs/errors';
import { isObject } from '../helpers';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'products', synchronize: false })
export class Product {
  @PrimaryColumn({ name: 'id' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 99)
  id: uuid;

  @Column({ name: 'description' })
  @IsString()
  @Length(0, 255)
  @IsOptional()
  description: string;

  @Column({ name: 'price' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  price: number;

  @Column({ name: 'title' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  title: string;

  private constructor() {
    this.id = null;
    this.description = null;
    this.price = null;
    this.title = null;
  }

  /**
   * Create a new product instance and fill it with source data
   * @param sourceData ProductDTO
   * @param skipMissingProperties Boolean
   * @returns Promise<Product>
   */
  static async createEntity(
    sourceData: ProductDTO,
    skipMissingProperties = false
  ): Promise<Product> {
    const entity = new Product();

    entity.mergeWithSourceData(sourceData);

    entity.id = uuid();

    // eslint-disable-next-line no-console
    console.log('entity:   ', entity);

    await entity.validateEntity(skipMissingProperties);

    return entity;
  }

  /**
   * Copy the fields values from source data if they are defined
   * @param sourceData ProductDTO
   * @returns void
   */
  protected mergeWithSourceData(sourceData: ProductDTO): void {
    if (!this._isDtoValid(sourceData)) {
      throw new ContentValidationError('Entity data is invalid');
    }

    Object.keys(this).forEach((fieldName: string) => {
      if (sourceData[fieldName] !== undefined) {
        this[fieldName] = sourceData[fieldName];
      }
    });
  }

  /**
   * Validate entity instance
   * @param skipMissingProperties boolean
   * @returns Promise<void>
   */
  protected async validateEntity(skipMissingProperties: boolean): Promise<void> {
    try {
      await validateOrReject(this, { skipMissingProperties });
    } catch (errors) {
      throw new ContentValidationError('Entity data is invalid');
    }
  }

  /**
   * Check properties values on valid
   * @param dtoObject ProductDTO
   * @returns boolean
   */
  private _isDtoValid(dtoObject: ProductDTO): boolean {
    if (!isObject(dtoObject)) {
      return false;
    }

    if (!Object.keys(dtoObject).length) {
      return false;
    }

    for (const prop in dtoObject) {
      if (dtoObject[prop] !== undefined) {
        return true;
      }
    }

    return false;
  }
}
