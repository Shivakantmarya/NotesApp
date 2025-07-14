const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
     title : String,
     content : String,
     tag : [String],
     createdAt: 
     {
          type : Date,
          default : Date.now
     }
});

const noteModel = mongoose.model("noteModel", noteSchema);

module.exports = noteModel;