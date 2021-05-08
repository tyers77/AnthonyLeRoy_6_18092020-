const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    //userId:{type:String,required:true},crée par mongo
    email:{type:String,required:true,unique:true},//demande du cadrage pour le P6 email unique
    password:{type:String,required:true},
}, { autoIndex: false });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);