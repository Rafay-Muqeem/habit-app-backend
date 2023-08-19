const Habit = require('../models/Habit');
const Subscription = require('../models/Subscription');
const webPush = require('web-push');

const sendNotification = async (reminder) => {
    try {
        const subscriber = await Subscription.find({ user: reminder.user })
        if (subscriber) {
            const options = {
                vapidDetails: {
                    subject: 'mailto:myemail@example.com',
                    publicKey: process.env.VAPID_PUBLIC_KEY,
                    privateKey: process.env.VAPID_PRIVATE_KEY,
                },
            };

            const habit = await Habit.findOne({ _id: reminder.habit })
            const res2 = await webPush.sendNotification(
                subscriber[0].subscriptionInfo,
                JSON.stringify({
                    title: `Reminder for ${habit.name}`,
                    // description: 'this message is coming from the server',
                    // image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg',
                }),
                options
            );
            // console.log(res2);

        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendNotification;
