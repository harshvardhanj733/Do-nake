const mongoose = require('mongoose');
// const schema = mongoose.Schema;
const {Schema} = mongoose;

const signUpForm = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

const donaters = mongoose.model("donater", signUpForm);

module.exports = donaters;

