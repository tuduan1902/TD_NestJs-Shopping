import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
   private products: Product[] = [];

   constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {

   }

   async insertProduct(title: string, desc: string, price: number) {
      const prodId = Math.random().toString();
      const newProduct = new this.productModel({
         title,
         description:  desc,
         price,
      })
      const result = await newProduct.save();
      return result.id as string;
   }

   getProducts() {
      return [...this.products];
   }

   getSingleProduct(productId:  string) {
      const product = this.findProduct(productId)[0];
      return {...product};
   }

   updateProduct(productId: string, title: string, desc: string, price: number) {
      const [product, index] = this.findProduct(productId);
      const updateProduct = {...product};
      if (title) {
         updateProduct.title = title;
      }
      if (desc) {
         updateProduct.description = desc;
      }
      if (price) {
         updateProduct.price = price;
      }
      this.products[index] = updateProduct;

   }

   deleteProduct(prodId: string) {
      const index = this.findProduct(prodId)[1];
      this.products.splice(index, 1);
   }

   private findProduct(id:string): [Product, number] {
      const productIndex = this.products.findIndex((prod) => prod.id === id);
      const product = this.products[productIndex];
      if(!product) {
         throw new NotFoundException('Could not find product.');
      } 
      return [product, productIndex];
   }
}