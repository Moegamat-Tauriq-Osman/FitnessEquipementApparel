const categoriesSchema = `
CREATE TABLE IF NOT EXISTS categories (
  categoryId CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

module.exports = categoriesSchema;