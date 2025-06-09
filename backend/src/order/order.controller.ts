import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt')) // Protect all routes in this controller
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() orderData, @Request() req) {
    const username = req.user.username;
    return this.orderService.create(orderData, username);
  }

  @Get() // For Admin: Get all orders
  findAll() {
    return this.orderService.findAll();
  }

  // --- NEW ENDPOINT FOR CUSTOMER ORDERS ---
  @Get('my-orders')
  findUserOrders(@Request() req) {
    const userId = req.user.userId;
    return this.orderService.findForUser(userId);
  }

  @Patch(':id/status') // For Admin: Update order status
  updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    // Note: We need to implement updateStatus in OrderService if we want buttons
    // For now, this endpoint exists but the service method might need to be added.
    // The previous response included the updateStatus method.
  }
}