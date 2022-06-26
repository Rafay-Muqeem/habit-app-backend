const express = require('express');
const User = require('../models/User');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "user@Token";

// Creating an endpoint and validating data with express-validator
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters long').isLength({min: 5}),
],
async (req, res) => {

//Checking whether request is normal
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()})
    }

//Checking for user with same email exist already
    try{

        let user = await User.findOne({email: req.body.email});

        if(user){
            return res.status(400).json({error: "User with this email already exist"});
        }

        const salt = await bcryptjs.genSalt(10);
        const secPass = await bcryptjs.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user:{
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_SECRET);
        // console.log({token});

        res.json({Message: "Successfully SignUp", token });

    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }   
    
})

module.exports = router