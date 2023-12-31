//This controller may have function that return json or render an page with parameters passage.


//Modules import
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const {db} = require('../public/javascripts/db');
const {User, UserModel} = require('../models/User');


// Middleware configuration for parsing HTML form data
app.use(bodyParser.urlencoded({extended: false}));
// Middleware configuration for parsing data in JSON format
app.use(bodyParser.json());
// Additional middleware configuration for parsing data in JSON format
app.use(express.json());
// Middleware configuration to serve static files
// from the 'public' directory in the application path
app.use(express.static(path.join(__dirname, 'public')));

//Function responsible for processing the user signup
const signup = async (req, res) => {
    const { userName, fullName, email, password } = req.body;

    try {
        UserModel.validateUser(userName, fullName, email);

        if (!UserModel.validatePassword(password)) {
            return res.status(400).json({ errorMessage: 'Invalid Password!' });
        }

        const isUserRegistered = await User.isUserRegistered(email);
        if (isUserRegistered) {
            return res.status(400).json('User is already Registered' );
        }

        const hashedPassword = await User.hashPassword(password);
        console.log(hashedPassword);
        const newUser = new User({ userName, fullName, email, password: hashedPassword });
        await newUser.save();
        res.redirect("/login");

    } catch (error) {
        res.status(error.statusCode || 500).json({ errorMessage: error.message });
        console.log(error.message);
    }
};

//Function responsible for processing the user login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.verifyCredentials(email, password);
        
        const passwordMatch = await user.checkPassword(password);
        if (!passwordMatch) {
            return res.status(400).json('Invalid Password!' );
        }

        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.isAdmin = user.isAdmin;

        res.redirect("/index");

    } catch (error) {
        if (error.isPasswordError) {
            return res.status(400).json('Invalid Password' );
        } else if (error.isUserError) {
            return res.status(400).json('User not found');
        }

        return res.status(error.statusCode || 500).json({ errorMessage: error.errorMessage });
    }
};


module.exports = {signup, login};