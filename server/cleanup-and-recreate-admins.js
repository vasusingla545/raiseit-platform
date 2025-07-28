const mongoose = require('mongoose');
const connectDB = require('./db/connect');
const Admin = require('./models/Admin');
require('dotenv').config();

const cleanupAndRecreate = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('✅ MongoDB connected!');

    // Delete all existing admins
    console.log('🗑️ Deleting all existing admins...');
    await Admin.deleteMany({});
    console.log('✅ All admins deleted!');

    // Now run the populate script to recreate them properly
    console.log('🔄 Recreating admins with proper password hashing...');
    
    const data = require('./states-and-districts.json');

    for (const stateObj of data.states) {
      const stateName = stateObj.state;
      const districts = stateObj.districts;

      for (const district of districts) {
        const districtNoSpecial = district.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const email = `${districtNoSpecial}admin@gmail.com`;

        // Create admin with plain text password - will be hashed by pre-save hook
        await Admin.create({
          name: `${district} Admin`,
          email: email,
          password: 'password', // Plain text - will be hashed by pre-save hook
          district: district
        });

        console.log(`✔️ Created admin: ${district} -> ${email}`);
      }

      console.log(`✅ ${stateName} admins done!`);
    }

    console.log('🎉 All admins recreated successfully!');
    console.log('📝 You can now login with:');
    console.log('   Email: anantapuradmin@gmail.com');
    console.log('   Password: password');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

cleanupAndRecreate(); 