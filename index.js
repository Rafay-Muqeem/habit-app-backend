const connectToMongo = require('./db');
const cors = require('cors');

const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

require('dotenv').config();
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/habit', require('./routes/habit'));
app.use('/api/reminder', require('./routes/reminder'));
app.get('/', (req, res) => {
    res.send("Home")
})
const PORT = process.env.PORT || 5000;

connectToMongo().then(() => {
    console.log("Connected Successfully");
    app.listen(PORT, () => {
        console.log(`Habit Tracker listening on ${PORT}`)
    })
}).catch(err => {
    console.log(err, "Connection Failed")
})

const schedule = require('node-schedule');
const Reminder = require('./models/Reminder');
const sendNotification = require('./notification/sendNotification');

const Subscription = require('./models/Subscription');
const webPush = require('web-push');

async function isSubscriptionValid(reminder) {
    const subscriber = await Subscription.findOne({ user: reminder.user })
    if (subscriber) {
        console.log(subscriber);
        // const options = {
        //     vapidDetails: {
        //         subject: 'mailto:myemail@example.com',
        //         publicKey: process.env.VAPID_PUBLIC_KEY,
        //         privateKey: process.env.VAPID_PRIVATE_KEY,
        //     },
        // }
        try {
            const isValid = await webPush.sendNotification(subscriber, '');
    
            return isValid;
        } catch (error) {
            console.log(error);
        }

    };
}

// TASK SCHEDULAR RUNS AT EVERY MINUTE
task = schedule.scheduleJob('* * * * *', async function () {
    try {
        const reminders = await Reminder.find()
        reminders.forEach(async (reminder) => {
            const currentTime = new Date();
            const current_time = `${currentTime.getHours() < 10 ? `0${currentTime.getHours()}` : currentTime.getHours()}:${currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes()}`;

            if (current_time === reminder.time) {
                // const res = await isSubscriptionValid(reminder)
                // console.log(res.statusCode);
                if (reminder.type === 'monthly') {
                    const current_date = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1 < 10 ? `0${currentTime.getMonth() + 1}` : currentTime.getMonth() + 1}-${currentTime.getDate() < 10 ? `0${currentTime.getDate()}` : currentTime.getDate()}`
                    if (current_date === reminder.date) {
                        await sendNotification(reminder)
                    }
                    return
                }
                else {
                    await sendNotification(reminder)
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
});
