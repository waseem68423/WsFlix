// /backend/src/product/product.controller.ts - CORRECTED (No Multer)

import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  // No more FileInterceptor, UploadedFile, or Multer types.
  // We expect the entire payload, including the image data, in the body.
  createProduct(@Body() productData: any) {
    return this.productService.create(productData);
  }

  @Get()
  findAll(
    @Query() filters: { 
      search?: string, 
      category?: string, 
      minPrice?: string, 
      maxPrice?: string 
    }
  ) {
    const parsedFilters = {
      ...filters,
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    }
    return this.productService.findAll(parsedFilters);
  }
}