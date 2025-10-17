const ordersSchema = `
CREATE TABLE IF NOT EXISTS orders (
  orderId CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);
`;

module.exports = ordersSchema;
