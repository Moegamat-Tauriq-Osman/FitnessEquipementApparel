const mysql = require("mysql2");
const config = require("./config");

// Import e-commerce schemas
const userSchema = require("../schemas/userSchema");
const categoriesSchema = require("../schemas/categoriesSchema");
const productsSchema = require("../schemas/productsSchema");
const cartSchema = require("../schemas/cartSchema");
const cartItemsSchema = require("../schemas/cartItemsSchema");
const ordersSchema = require("../schemas/ordersSchema");
const orderItemsSchema = require("../schemas/orderItemsSchema");

const connectDB = () => {
  return new Promise((resolve, reject) => {
    const { database, ...baseConfig } = config;
    const tempConn = mysql.createConnection(baseConfig);

    // Create database if not exists
    tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``, (err) => {
      if (err) return reject(err);
      console.log(`Database '${database}'`);

      const pool = mysql.createPool(config);

      pool.getConnection((err, conn) => {
        if (err) return reject(err);

        {/* users table */ }
        conn.query(userSchema, (userErr) => {
          if (userErr) return reject(userErr);
          console.log("'users' table created");

            {/* categories table */ }
            conn.query(categoriesSchema, (catErr) => {
              if (catErr) return reject(catErr);
              console.log("'categories' table created");

              {/* products table */ }
              conn.query(productsSchema, (prodErr) => {
                if (prodErr) return reject(prodErr);
                console.log("'products' table created");

                {/* carts table */ }
                conn.query(cartSchema, (cartErr) => {
                  if (cartErr) return reject(cartErr);
                  console.log("'carts' table created");

                  {/* cart items table */ }
                  conn.query(cartItemsSchema, (cartItemErr) => {
                    if (cartItemErr) return reject(cartItemErr);
                    console.log("'cart_items' table created");

                    {/* orders table */ }
                    conn.query(ordersSchema, (orderErr) => {
                      if (orderErr) return reject(orderErr);
                      console.log("'orders' table created");

                      {/* order items table */ }
                      conn.query(orderItemsSchema, (orderItemErr) => {
                        if (orderItemErr) return reject(orderItemErr);
                        console.log("'order_items' table created");

                        conn.release();
                        resolve(pool);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
};

module.exports = connectDB;
