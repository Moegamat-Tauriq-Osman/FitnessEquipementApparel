const orderItemsSchema = `
CREATE TABLE IF NOT EXISTS order_items (
  orderItemId CHAR(36) PRIMARY KEY,
  orderId CHAR(36) NOT NULL,
  productId CHAR(36),
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (orderId) REFERENCES orders(orderId) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(productId) ON DELETE SET NULL
);
`;

module.exports = orderItemsSchema;
