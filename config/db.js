const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greenbite', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;