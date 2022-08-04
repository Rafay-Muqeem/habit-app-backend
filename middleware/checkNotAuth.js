const jwt = require("jsonwebtoken");
require('dotenv').config();

const checkNotAuth = (req, res, next) => {
    const token = req.header("auth-token");
    console.log(token)
    if(token){
        res.redirect('/dashboard');
    }
    next();
}

module.exports = checkNotAuth;