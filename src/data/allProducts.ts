import { DigitalProduct } from '../types';
import { CATALOG_PRODUCTS } from './catalogItems';
import { CATALOG_PRODUCTS_PART2 } from './catalogItems2';
import { CATALOG_PRODUCTS_PART3 } from './catalogItems3';
import { CATALOG_PRODUCTS_PART4 } from './catalogItems4';

export const ALL_UPLOADED_PRODUCTS: DigitalProduct[] = [
  ...CATALOG_PRODUCTS,
  ...CATALOG_PRODUCTS_PART2,
  ...CATALOG_PRODUCTS_PART3,
  ...CATALOG_PRODUCTS_PART4,
];

export const INITIAL_PRODUCTS: DigitalProduct[] = ALL_UPLOADED_PRODUCTS;
