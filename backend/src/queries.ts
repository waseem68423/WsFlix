export const queries = {
  CREATE_USERS_TABLE: `
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      name VARCHAR(255),
      username VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role VARCHAR(50) DEFAULT 'customer' -- Added role
    );
  `,
  CREATE_PRODUCTS_TABLE: `
    CREATE TABLE products (
      id UUID PRIMARY KEY,
      name VARCHAR(255),
      description TEXT,
      category VARCHAR(255),
      price DECIMAL,
      quantity INTEGER,
      imageUrl VARCHAR(255)
    );
  `,
  CREATE_ORDERS_TABLE: `
    CREATE TABLE orders (
      id UUID PRIMARY KEY,
      userId UUID,
      totalPrice DECIMAL,
      deliveryAddress TEXT,
      customerName VARCHAR(255),
      customerPhone VARCHAR(255),
      status VARCHAR(50),
      createdAt TIMESTAMP,
      items JSONB
    );
  `
};