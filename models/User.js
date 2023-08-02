const {db} = require('../public/javascripts/db');
const mongoose = require('mongoose');

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
    }

});

userSchema.statics.verifyCredentials = async function(email, password) {

    console.log('Verifying credentials...');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
        const user = await this.findOne({email});
        if(!user) {
            console.log('User not found');
            throw new Error('User not found');
        }
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

userSchema.statics.isUserRegistered = async function(email) {

    try {
        const user = await this.findOne({email});
        return user !== null;
    } catch (error) {
        console.error('Error verifying user registration: ', error.message);
        throw error;
    }

};

class UserModel {
    constructor(userName, fullName, email, password) {
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    static validateUser(userName, fullName, email) {
        if (userName === "" || userName === null) {
            throw new Error('Invalid User Name');
        } else if(fullName === "" || fullName === null) {
            throw new Error('Invalid Full Name');
        } else if(email === "" || email === null) {
            throw new Error('Invalid Email');
        }
    }

    static validatePassword(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if(password === "" || password === null) {
            throw new Error('Invalid Password');
        } else {
            return passwordPattern.test(password);
        }
    }

}


const User = mongoose.model('User', userSchema);

module.exports = {User, UserModel};
