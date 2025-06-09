import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DbService } from '../db.service';
import { ProductService } from '../product/product.service'; // Needed for order logic
import { UserService } from '../user/user.service'; // Needed for order logic

@Module({
  providers: [OrderService, DbService, ProductService, UserService], // Provide all dependencies
  controllers: [OrderController],
})
export class OrderModule {}