// /backend/src/product/product.service.ts - CORRECTED (No Multer)

import { Injectable } from '@nestjs/common';
import { DbService } from '../db.service';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';
import { queries } from '../queries';

@Injectable()
export class ProductService {
  constructor(private dbService: DbService) {
    console.log('ProductService aware of schema:', queries.CREATE_PRODUCTS_TABLE);
  }

  // --- THIS IS THE NEW create METHOD ---
  async create(productData: any) {
    // 1. Decode the base64 image data
    // The data URL looks like "data:image/jpeg;base64,L2..."
    // We need to split it at the comma and take the second part.
    const matches = productData.imageDataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image data');
    }
    
    const imageType = matches[1]; // e.g., 'image/jpeg'
    const imageBuffer = Buffer.from(matches[2], 'base64');
    const extension = imageType.split('/')[1]; // e.g., 'jpeg'

    // 2. Create a unique filename
    const filename = `product-${Date.now()}-${randomUUID().substring(0, 8)}.${extension}`;
    const imagePath = join(process.cwd(), 'public', 'uploads', filename);

    // 3. Save the image file to the disk
    await fs.writeFile(imagePath, imageBuffer);
    
    // 4. Create the product record for db.json
    const db = await this.dbService.readDb();
    const newProduct = {
      id: randomUUID(),
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity, 10),
      imageUrl: `/uploads/${filename}`, // The path to the newly saved image
    };

    db.products.push(newProduct);
    await this.dbService.writeDb(db);
    return newProduct;
  }
  // --- END OF NEW METHOD ---

  async findAll(filters: { search?: string, category?: string, minPrice?: number, maxPrice?: number }) {
    const db = await this.dbService.readDb();
    let filteredProducts = [...db.products];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice);
    }
    return filteredProducts;
  }

  async findOne(id: string) {
    const db = await this.dbService.readDb();
    return db.products.find(p => p.id === id);
  }
}