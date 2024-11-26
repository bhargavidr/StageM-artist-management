const mongoose = require('mongoose');

const configureDB = async () => { 
    try {
        const db = await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};

module.exports = configureDB