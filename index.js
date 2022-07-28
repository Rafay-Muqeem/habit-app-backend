const connectToMongo = require('./db');
const cors = require('cors');
connectToMongo();

const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

const moment = require('moment');
const Habit = require('./models/Habit');
require('dotenv').config();

const timeInSec = moment().endOf('day').valueOf();
const Interval = timeInSec - Date.now();

const updateDataMidnight = async () => {
    try {
        await Habit.updateMany({ done: false }, {
            $set: {
                streak: 0
            }
        });

        await Habit.updateMany({ done: true }, {
            $set: {
                done: false
            }
        });

    } catch (error) {
        console.log(error);
    }

}

const updateWeekData = async () => {
    try {
        console.log("week")
        await Habit.updateMany({}, {
            $set: {
                weeklyRecord: []
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}

setInterval(async () => {

    if ((new Date()).getDay() === 0) {
        updateWeekData();
    }
    updateDataMidnight();

}, Interval);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/habit', require('./routes/habit'));
app.get('/', (req, res) => {
    res.send("Home")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Habit Tracker listening on ${PORT}`)
})
