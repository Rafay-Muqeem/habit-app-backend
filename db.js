const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/habit-app";

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected Successfully");
    });
}

module.exports = connectToMongo;