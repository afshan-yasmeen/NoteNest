const mongoose = require('mongoose');
const mongoURI="mongodb://localhost:27017/iNoteBook"


const connectToMongoDB=async()=>{
  try {
    await mongoose.connect(mongoURI)
    console.log("Connected to DB")
  } catch (error) {
    console.log("Error connected to DB: ", error)
  }
}

module.exports=connectToMongoDB;

