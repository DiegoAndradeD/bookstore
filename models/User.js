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
            const error = new Error('User not found');
            console.log('User not found');
            throw error;
        }
        const isPasswordValid = user.password === password;
        if(!isPasswordValid) {
            const error = new Error('Password Invalid');
            console.log('Password Invalid')
            throw error;
        }
        return user;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.isUserRegistered = async function(email) {

    try {
        const user = await this.findOne({email});
        return user !== null;
    } catch (error) {
        throw error;
    }

};



const User = mongoose.model('User', userSchema);

module.exports = User;