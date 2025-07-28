const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

async function testAdminLogin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected!');

  // Test with a known admin
  const testEmail = 'anantapuradmin@gmail.com';
  const testPassword = 'password';

  console.log(`Testing login for: ${testEmail}`);
  console.log(`Password: ${testPassword}`);

  // Find the admin
  const admin = await Admin.findOne({ email: testEmail });
  
  if (!admin) {
    console.log('❌ Admin not found!');
    return;
  }

  console.log('✅ Admin found:', admin.name);
  console.log('Stored password hash:', admin.password);

  // Test password comparison
  const isMatch = await admin.comparePassword(testPassword);
  console.log('Password match result:', isMatch);

  // Let's also test manual bcrypt comparison
  const manualMatch = await bcrypt.compare(testPassword, admin.password);
  console.log('Manual bcrypt comparison:', manualMatch);

  // Test with double-hashed password (what might be happening)
  const doubleHashed = await bcrypt.hash(testPassword, 10);
  const doubleHashedMatch = await bcrypt.compare(testPassword, doubleHashed);
  console.log('Double-hashed comparison:', doubleHashedMatch);

  // Test if the stored password is actually double-hashed
  const isDoubleHashed = await bcrypt.compare(doubleHashed, admin.password);
  console.log('Is password double-hashed?', isDoubleHashed);

  mongoose.disconnect();
}

testAdminLogin().catch(err => {
  console.error(err);
  mongoose.disconnect();
}); 