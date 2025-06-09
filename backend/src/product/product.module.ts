import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DbService } from '../db.service';

@Module({
  providers: [ProductService, DbService], // Provide both services
  controllers: [ProductController],
})
export class ProductModule {}