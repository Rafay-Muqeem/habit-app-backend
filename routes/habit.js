const express = require("express");
const router = express.Router();
const Habit = require('../models/Habit');
const fetchUser = require('../middleware/fetchuser');
const {body, validationResult} = require('express-validator');

// Router 1 : fetch all habits of a respective user
router.get('/fetchallhabits',fetchUser, async(req, res) => {
    try{
        const habits = await Habit.find({user: req.user.id});
        res.json(habits);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Router 2 : Add habits for a respective user
router.post('/addhabit', fetchUser, [
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('description', 'description must be atleast 5 characters long').isLength({min: 5})
], async(req, res) => {

    //Checking whether request is normal
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()})
    }

    try{
        const {name, description, streak} = req.body;

        const habit = new Habit({
            user: req.user.id, name, description, streak
        })

        const saveHabit = await habit.save();
        res.json(saveHabit);
        
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Router 3: Delete habits of a respective user
router.put('/updatehabit/:id', fetchUser, async(req, res) => {
    
    const {name, description} = req.body;
    const newHabit = {};
    if(name){
        newHabit.name = name;
    }
    if(description){
        newHabit.description = description;
    }

    let habit = await Habit.findById(req.params.id);
    if(!habit){
        return res.status(404).send("Not Found");
    }

    if(habit.user.toString() !== req.user.id){
        return res.status(401).send("Unauthorized Not Allowed");
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, {$set : newHabit}, {new: true});

    res.json({habit});

})

module.exports = router;