import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db.service';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { randomUUID } from 'crypto';
import { queries } from '../queries';

@Injectable()
export class OrderService {
  constructor(
    private dbService: DbService,
    private productService: ProductService,
    private userService: UserService,
  ) {
    console.log('OrderService aware of schema:', queries.CREATE_ORDERS_TABLE);
  }

  async create(orderData: any, username: string) {
    const db = await this.dbService.readDb();
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of orderData.items) {
      const product = await this.productService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }
      totalPrice += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const newOrder = {
      id: randomUUID(),
      userId: user.id,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      deliveryAddress: orderData.deliveryAddress,
      totalPrice: totalPrice,
      status: 'Done', // Set to "Done" by default as per your request
      createdAt: new Date().toISOString(),
      items: orderItems,
    };

    db.orders.push(newOrder);
    await this.dbService.writeDb(db);
    return newOrder;
  }

  async findAll() {
    const db = await this.dbService.readDb();
    const populatedOrders = db.orders.map(order => {
      const user = db.users.find(u => u.id === order.userId);
      return {
        ...order,
        user: {
          username: user?.username || 'Unknown',
          email: user?.email || 'Unknown',
        }
      };
    });
    return populatedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- NEW METHOD FOR CUSTOMER ORDERS ---
  async findForUser(userId: string) {
    const db = await this.dbService.readDb();
    
    // Filter orders to get only those belonging to the logged-in user
    const userOrders = db.orders.filter(order => order.userId === userId);
    
    // Sort by most recent first
    return userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}