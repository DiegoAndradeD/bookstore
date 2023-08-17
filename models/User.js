const {db} = require('../public/javascripts/db');
const mongoose = require('mongoose');

//User model mongoDB schema
const userSchema = new mongoose.Schema ({

    userName: {
        type: String,
        require: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    favoriteBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      }],
    shoppingCart: [{
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    quantity: {
        type: Number,
        default: 1,
    },
    }],

});

//Static method to verify the user credentials
userSchema.statics.verifyCredentials = async function(email, password) {

    console.log('Verifying credentials...');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
        //Verify the user by it's email, that is unique in the Database
        const user = await this.findOne({email});
        if(!user) {
            console.log('User not found');
            throw new Error('User not found');
        }
        //Verify if the password matches the user registered password
        const isPasswordValid = user.password === password;
        if(!isPasswordValid) {
            console.log('Password Invalid')
            throw new Error('Password Invalid');
        }
        return user;
    } catch (error) {
        console.error('Error verifying credentials: ', error.message);
        throw error;
    }
};

//Static method to verify if the user is registered
//The search looks for an email in the database, that is a unique attribute, to see if it matches
userSchema.statics.isUserRegistered = async function(email) {

    try {
        const user = await this.findOne({email});
        return user !== null;
    } catch (error) {
        console.error('Error verifying user registration: ', error.message);
        throw error;
    }

};

//This middleware verifies if the user logged is an admin
const isAdminMiddleware = async (req, res, next) => {
    //Prevents the normal user from being able to enter an admin-only access page, redirecting him to the login page
    if (!req.session.userId || !req.session.email) {
      return res.redirect('/Login'); 
    }
    
    //Check the isAdmin attribute from the user after finding him in the database by an email search
    try {
        const user = await User.findOne({ email: req.session.email });

        if (!user.isAdmin) {
            return res.status(403).json({ errorMessage: 'Admin only access page!' });
        }
        next();
    } catch (error) {
      console.error('Error checking admin status:', error.message);
      return res.status(403).send('Access forbidden'); 
    }
  };

//UserModel class and attributes
class UserModel {
    constructor(userName, fullName, email, password) {
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    //Basic validation to not empty and not null username, full name or email
    static validateUser(userName, fullName, email) {
        if (userName === "" || userName === null) {
            throw new Error('Invalid User Name');
        } else if(fullName === "" || fullName === null) {
            throw new Error('Invalid Full Name');
        } else if(email === "" || email === null) {
            throw new Error('Invalid Email');
        }
    }

    //Basic validation for non-empty, non-null and standardized password
    static validatePassword(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if(password === "" || password === null) {
            throw new Error('Invalid Password');
        } else {
            return passwordPattern.test(password);
        }
    }
}

// Creation of the user model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = {User, UserModel, isAdminMiddleware};
