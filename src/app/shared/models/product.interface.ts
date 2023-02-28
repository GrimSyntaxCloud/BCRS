
/*
Title: product.interface.ts
Author: Professor Krasso
Updated Date: 02/21/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: product interface
*/

export interface Product {
  id: number;
  title: string;
  price: number;
  descriptions: Array<string>;
}
