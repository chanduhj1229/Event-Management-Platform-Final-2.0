require('dotenv').config();
const mongoose = require('mongoose');

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Verify URI is loaded

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000, // 20 seconds timeout
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  mongoose.connection.close();
})
.catch(err => {
  console.error('Connection error:', err);
});