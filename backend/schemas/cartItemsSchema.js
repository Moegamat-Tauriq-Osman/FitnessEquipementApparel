const cartItemsSchema = `
CREATE TABLE IF NOT EXISTS cart_items (
  cartItemId CHAR(36) PRIMARY KEY,
  cartId CHAR(36) NOT NULL,
  productId CHAR(36) NOT NULL,
  quantity INT DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cartId) REFERENCES carts(cartId) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(productId) ON DELETE CASCADE
);
`;

module.exports = cartItemsSchema;
