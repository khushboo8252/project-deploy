const express = require("express");
const {NoteModel}=require("../models/noteModels");
const {auth}=require("../middleware/auth.middleware");
const noteRouter = express.Router();

noteRouter.post("/create",auth,async(req,res)=>{
    try {
        const note = new NoteModel(req.body);
        await note.save();
        res.send({"msg":"a new note has been created"})
    } catch (error) {
        res.send({"error":error})
    }
})

noteRouter.get("/",auth,async(req,res)=>{
    try {
        const notes = await NoteModel.find();
        res.send(notes)
    } catch (error) {
        res.send({"error":error})
    }
})

noteRouter.patch("/update/:noteId",auth,async(req,res)=>{
    const {noteId}=req.params;
    try {
        await NoteModel.findByIdAndUpdate({_id:noteId},req.body)
        res.send(`note has been updated with the id: ${noteId}`)
    } catch (error) {
        res.send({"error":error})
    }
})

noteRouter.delete("/delete/:noteId",auth,async(req,res)=>{
    const {noteId}=req.params;
    try {
        await NoteModel.findByIdAndDelete({_id:noteId},req.body)
        res.send(`note has been deleted with the id: ${noteId}`)
    } catch (error) {
        res.send({"error":error})
    }
})

module.exports={
    noteRouter
}