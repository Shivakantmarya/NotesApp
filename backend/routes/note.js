const express = require("express");
const mongoose = require("mongoose");
const router1 = express.Router();
const notesModel = require("../models/notes");


//create newNotes
router1.post("/create", async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    const newNotes = new notesModel({ title, content, tag });
    await newNotes.save();
    console.log(newNotes);
    res.json(newNotes);
  } catch (err) {
    res.json("Internal Error", err);
  }
});

//get all notes
router1.get("/all", async (req, res) =>{
    try{
         const notes = await notesModel.find().sort({createdAt:-1});
         res.status(200).json(notes);
    }
    catch(err){
        res.status(500).json({error : "failed to fetch notes"});
    }
});

//get a single note by id
router1.get("/:id", async (req, res) =>{
     try{
          const note = await notesModel.findById(req.params.id);
          if(!note){
             return res.status(404).json({error : "note not found"});
          }

          res.status(200).json(note);
     }
     catch(err){
         res.status(500).json({error:"failed to fetch note"});
     }
});

//update note
router1.put("/update/:id", async (req, res) =>{
    
     try{
          const {title, content, tag} = req.body;
          const updateData = await notesModel.findByIdAndUpdate(req.params.id,
              {title, content, tag}, {new : true}
          );
          res.status(200).json(updateData);
     }
     catch(err){
        res.status(500).json({error: "failed to update note"});
     }
});

//delete notes
router1.delete("/delete/:id", async (req, res)=>{
    try{
         const delData = await notesModel.findByIdAndDelete(req.params.id);

         if(!delData){
            res.status(404).json({error: "Notes not found"});
         }

         res.status(200).json({error: "Note deleted successfully"});
    }
    catch(err){
         res.status(500).json({error: "Failed to delete note"});
    }
})


module.exports = router1;
