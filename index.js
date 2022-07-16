const connectToMongo = require('./db');
const cors = require('cors');
connectToMongo();

const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const moment = require('moment');
const Habit = require('./models/Habit');

const timeInSec = moment().endOf('day').valueOf();
const Interval = timeInSec - Date.now();

const date = new Date();
let day = date.getDay();

const updateDataMidnight = async () => {
    try {
        await Habit.updateMany({ done: false }, {
            $set: {
                done: false,
                streak: 0
            }
        });

        await Habit.updateMany({ done: true }, {
            $set: {
                done: false
            },
            $push: {
                doneDate: day
            },
            $inc: {
                streak: 1
            }
        });

    } catch (error) {
        console.log(error);
    }

}

const updateWeekData = async() => {
    try{
        await Habit.updateMany({}, {
            $set: {
                doneDate: []
            }
        })
    }
    catch(error){
        console.log(error);
    }
}

setInterval(async () => {

    updateDataMidnight();

    if(day == 6){
        updateWeekData();
    }

}, Interval);


app.use('/api/auth', require('./routes/auth'));
app.use('/api/habit', require('./routes/habit'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
