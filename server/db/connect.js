// const mongoose = require('mongoose')

// const connectDB = (MONGO_URI) => {
//   return mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
// }

// module.exports = connectDB
const mongoose = require('mongoose');

const connectDB = async (MONGO_URI) => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
