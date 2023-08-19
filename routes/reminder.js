const express = require('express')
const router = express.Router();
const Reminder = require('../models/Reminder');
const fetchUser = require('../middleware/fetchuser');

router.get('/fetchallreminders/:id', fetchUser, async(req, res) => {
    try {
        const reminders = await Reminder.find({habit: req.params.id});
        return res.status(200).send(reminders)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/sethabitreminder/:id', fetchUser, async (req, res) => {
    try {
        const data = {
            user: req.user.id,
            habit: req.params.id,
            date: req.body.date,
            time: req.body.time,
            type: req.body.type,
        }
        
        const existReminder = await Reminder.findOne({habit: req.params.id, time: data.time});
        if (existReminder) {
            return res.status(409).json({ message: 'Reminder of this habit with this time already exists' });
        }
        
        const reminder = await Reminder.create(data)

        return res.status(200).json({ Success: "Reminder Set Successfully", reminder: reminder });

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;