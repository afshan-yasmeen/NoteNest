const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
//Route 1: Get notes of user :  GET "/api/notes/fetchallnotes" Authentication Required

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    // Get User from req
    const userId = req.user.id;

    // Get Notes
    const notes = await Notes.find({ user: userId });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 2: Add a new note  :  POST "/api/notes/addnote" Authentication Required

router.post(
  "/addnote",
  fetchUser,
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters"),
    body("tag")
      .isLength({ min: 1 })
      .withMessage("Tag must be at least 1 character"),
  ],
  async (req, res) => {
    // Destructuring the req
    try {
      const userId = req.user.id; // req.user is populated by fetchUser middleware
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //Creating A note
      const note = new Notes({
        title: title,
        description: description,
        tag: tag,
        user: req.user.id,
      });
  
      // Saving the note
      const savednote = await note.save();

      res.json(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//Route 3: Update an existing note : PUT "/api/notes/updatenote/:id" Authentication Required
router.put(
  "/updatenote/:id",
  fetchUser,
  [
    body("title").isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
    body("description").isLength({ min: 5 }).withMessage("Description must be at least 5 characters"),
    body("tag").isLength({ min: 1 }).withMessage("Tag must be at least 1 character"),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Build updated note object
      const updatedNote = {};
      if (title) updatedNote.title = title;
      if (description) updatedNote.description = description;
      if (tag) updatedNote.tag = tag;

      // Find the note to be updated and verify if it exists
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Note Not Found" });
      }

      // Ensure the note belongs to the logged-in user
      if (note.user && note.user.toString() !== req.user.id) {
        return res.status(401).json({ error: "Not Authorized" });
      }

      // Update the note
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: updatedNote },
        { new: true }
      );

      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


//Route 4: Delete an existing note : DELETE "/api/notes/deletenote/:id" Authentication is required
router.delete("/deletenote/:id", fetchUser, async(req,res)=>{
try{
  // Find the note to be deleted and verify if it exists
  let note=await Notes.findById(req.params.id);
  if(!note){
    return res.status(404).json({error:"Note Not Found"});
    }
    // Ensure the note belongs to the logged-in user
    if(note.user && note.user.toString() !== req.user.id){
      return res.status(401).json({error:"Not Authorized"});
    }
    // Delete the note
    await Notes.findByIdAndDelete(req.params.id);
    res.json({success:"Note has been deleted successfully"}); 
}catch(error){
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
})



module.exports = router;
