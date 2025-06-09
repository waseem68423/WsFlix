import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService } from '../db.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { queries } from '../queries';

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer';
  validatePassword: (password: string) => Promise<boolean>;
};

const UserPrototype = {
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  },
};

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private dbService: DbService) {
    console.log('UserService aware of schema:', queries.CREATE_USERS_TABLE);
  }

  async onModuleInit() {
    console.log('Checking for default admin user...');
    const db = await this.dbService.readDb();
    const adminExists = db.users.some(user => user.email === 'admin@wsflix.com');

    if (!adminExists) {
      console.log('Admin user not found. Creating default admin...');
      const adminUser = {
        id: randomUUID(),
        name: 'Admin',
        username: 'admin',
        email: 'admin@wsflix.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin' as 'admin',
      };
      db.users.push(adminUser);
      await this.dbService.writeDb(db);
      console.log('Default admin user created successfully.');
    } else {
      console.log('Default admin user already exists.');
    }
  }

  async create(userData: any): Promise<Omit<User, 'password'>> {
    const db = await this.dbService.readDb();
    
    const userExists = db.users.some(u => u.username === userData.username || u.email === userData.email);
    if (userExists) {
      throw new Error('Username or email already exists');
    }

    const role: 'admin' | 'customer' = 
      userData.email === 'admin@wsflix.com' ? 'admin' : 'customer';

    const newUser: User = {
      id: randomUUID(),
      name: userData.name,
      username: userData.username,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
      role: role,
      validatePassword: UserPrototype.validatePassword,
    };

    db.users.push(newUser);
    await this.dbService.writeDb(db);

    const { password, ...result } = newUser;
    return result;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const db = await this.dbService.readDb();
    const user = db.users.find(u => u.email === email);
    if (user) {
      user.validatePassword = UserPrototype.validatePassword;
    }
    return user;
  }

  // --- THIS METHOD IS NOW CORRECTLY DEFINED ---
  async findOneByUsername(username: string): Promise<User | undefined> {
    const db = await this.dbService.readDb();
    const user = db.users.find(u => u.username === username);
    if (user) {
      user.validatePassword = UserPrototype.validatePassword;
    }
    return user;
  }
}