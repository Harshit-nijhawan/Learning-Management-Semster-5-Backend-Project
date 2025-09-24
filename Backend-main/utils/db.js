const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB connected successfully")
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
    
}

module.exports = connectDb;