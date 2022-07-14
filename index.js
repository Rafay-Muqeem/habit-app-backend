const connectToMongo = require('./db');
const cors =require('cors');
connectToMongo();

const express = require('express');
const app = express();;
const port = 5000;

app.use(express.json());
app.use(cors());

const moment = require('moment');
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/habit-app";

const timeInSec = moment().endOf('day').valueOf();
const Interval = timeInSec - Date.now();

setInterval(async ()=>{
    mongoose.connect(mongoURI, (error, db) => {
        if(error) console.log(error);
    
        var myquery = {done: false};
        var newvalues = { $set: {done: false, streak: 0} };
        db.collection("habits").updateMany( myquery, newvalues);

        var myquery2 = { done: true };
        var newvalues2 = { $set: {done: false} ,  $inc: {streak:1} };
        db.collection("habits").updateMany( myquery2, newvalues2);
        
    });

}, Interval);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/habit', require('./routes/habit'));

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
