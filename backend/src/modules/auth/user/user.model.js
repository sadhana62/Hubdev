const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", user);
