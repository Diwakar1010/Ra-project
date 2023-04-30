const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type: String , required:true },  // default: "bobby"},
    email:{type: String , unique:true},     //default: "bobby@gmail.com" },
    password:{type: String , required:true},  // default:"diwaaa"},
    // confirmPassword:{type: String , required:true, default: "diwaa"}
});

const userDetails = mongoose.model('RegistrationDetail', userSchema);
module.exports = userDetails;