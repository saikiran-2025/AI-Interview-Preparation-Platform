let mongoose = require("mongoose");
let us = new mongoose.Schema({
    "username": {
        type: String,
        required: [true, "Username is required"],
        unique: true, 
        trim: true    
    },
    "pwd": {
        type: String,
        required: [true, "Password is required"]
    }
});

// Both login and registration will point to the 'users' collection now
let um = mongoose.model("User", us);
module.exports = um;