import { Injectable, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DbService } from './db.service';
import * as fs from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const dbPath = join(process.cwd(), 'db.json');

// This service runs ONCE when the app starts to set everything up.
@Injectable()
export class AppInitializer implements OnModuleInit {
  constructor(private readonly dbService: DbService) {}

  async onModuleInit() {
    console.log('App Initializer: Checking database file and admin user...');

    // Step 1: Ensure db.json exists.
    if (!fs.existsSync(dbPath)) {
      console.log('db.json not found, creating it...');
      await this.dbService.writeDb({ users: [], products: [], orders: [] });
    }

    // Step 2: Ensure default admin exists.
    const db = await this.dbService.readDb();
    const adminExists = db.users.some(user => user.email === 'admin@wsflix.com');

    if (!adminExists) {
      console.log('Admin user not found, creating default admin...');
      const adminUser = {
        id: randomUUID(),
        name: 'Admin',
        username: 'admin',
        email: 'admin@wsflix.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      };
      db.users.push(adminUser);
      await this.dbService.writeDb(db);
      console.log('Default admin user created.');
    } else {
      console.log('Default admin user already exists.');
    }
  }
}


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // NO TypeOrmModule here
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
  ],
  // Provide DbService and our initializer here. They will be available to all other modules.
  providers: [DbService, AppInitializer],
})
export class AppModule {}