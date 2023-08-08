const mongoose = require('mongoose');
require('dotenv').config();
// const mongoURI = "mongodb://localhost:27017/habit-app";

const mongoURI = process.env.DATABASE
const connectToMongo = async () => {
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = connectToMongo;