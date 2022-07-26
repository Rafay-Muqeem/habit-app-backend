const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.DATABASE;

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
      
    }).then( () => {
        console.log("Connected Successfully");
    }).catch( (err) => console.log(err));
}

module.exports = connectToMongo;