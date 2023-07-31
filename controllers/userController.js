const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const {db} = require('../public/javascripts/db');
const User = require('../models/User');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const signup = async (req, res) => {

   const {userName, fullName, email, password} = req.body;

   try {
    const isUserRegistered = await User.findOne({email});
    if(isUserRegistered) {
        return res.status(400).json({message: 'User is already Registered'});
    }

    const newUser = new User({userName, fullName, email, password});

    await newUser.save();

    res.status(201).json({message: 'User registered Successfully'});
    console.log('User registered Successfully');
   } catch (error) {
    res.status(500).json({message: 'Error Registering user'});
    console.log('Error Registering user');
   }

}

const login = async (req, res) => {

    const {email, password} = req.body;

    try {
        const user = await User.verifyCredentials(email, password);
        req.session.userId = user._id;
        req.session.email = user.email;
        console.log("user logged");
        return res.status(201).json({ successMessage: 'Login Completed'});
    } catch (error) {
        console.log('error logging', error.message);
        res.status(error.statusCode || 500).json({message: error.message});
    }

};

module.exports = {signup, login};