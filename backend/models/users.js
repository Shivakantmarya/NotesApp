const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : String,
    email : {type: String, unique: true},
    password : String,

    profilePic: {
        type : String,
        default : ""
    }
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;