const mongoose = require('mongoose');
require('dotenv').config(); // Ensure dotenv is loaded for MONGODB_URI

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1); // Exit if database connection fails
    }
};

module.exports = connectDB; // Export the function