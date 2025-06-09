import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'db.json');

export interface DbStructure {
  users: any[];
  products: any[];
  orders: any[];
}

@Injectable()
export class DbService {
  async readDb(): Promise<DbStructure> {
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { users: [], products: [], orders: [] };
      }
      throw error;
    }
  }

  async writeDb(data: DbStructure): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  }
}