import { OrderItem } from './order-item.entity';

export class Order {
  id: string;
  userId: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalPrice: number;
  status: string;
  createdAt: Date | string;
  items: OrderItem[];
}