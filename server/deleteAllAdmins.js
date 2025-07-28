require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./db/connect');

const deleteAdmins = async () => {
  await connectDB(process.env.MONGO_URI);
  const result = await Admin.deleteMany({});
  console.log(`Deleted ${result.deletedCount} admins.`);
  mongoose.disconnect();
};

deleteAdmins();