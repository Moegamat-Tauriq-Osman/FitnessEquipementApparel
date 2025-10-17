const productsSchema = `
CREATE TABLE IF NOT EXISTS products (
  productId CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  categoryId CHAR(36),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(categoryId) ON DELETE SET NULL
);
`;

module.exports = productsSchema;
