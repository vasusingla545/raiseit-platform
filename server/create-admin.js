// Raise-It/server/create-admin.js
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = new Admin({
    name: 'Vasu Singla',
    email: 'vasusingla41@gmail.com',
    password: '41414141', // will be hashed by pre-save hook
    district: 'Fazilka', // <-- Add this line with a valid district name
    // add other required fields if any
  });

  await admin.save();
  console.log('Admin created:', admin.email);
  mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error(err);
  mongoose.disconnect();
});