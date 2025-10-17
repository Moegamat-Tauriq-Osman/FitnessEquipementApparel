require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { createTable, checkRecordExists, insertRecord } = require('../utils/sqlFunctions');
const userSchema = require('../schemas/userSchema');

const seedUsers = async () => {
  try {
    await createTable(userSchema);

    const adminEmail = 'admin@fitnessEA.com';
    const existingAdmin = await checkRecordExists('users', 'email', adminEmail);

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await insertRecord('users', {
        userId: uuidv4(),
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin seeded');
    } else {
      console.log('Admin already exist');
    }
  } catch (err) {
    console.error('admin seed failed:', err);
  }
};

module.exports = seedUsers;
