const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { autoIndex: false });

userSchema.plugin(uniqueValidator);//email unique

module.exports = mongoose.model("User", userSchema);