import React from "react";
import { useState } from "react";
import NotesContext from "./NotesContext";
const NotesState = (props) => {
  const host = "http://localhost:5000";

  const notesInitial =[];

  const [notes, setNotes] = useState(notesInitial);


   //Fetch all Note
   const getNotes = async() => {
    
    // Api Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem("authToken")  
      },
    });

    const json= await response.json();
    setNotes(json)
    console.log("Fetch all notes: \n"+ json);
  
  };

  //Add a Note
  const addNote = async(title, description, tag) => {
    // Api Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem("authToken") 
      },
      body: JSON.stringify({title, description, tag}),
    });

    const note = await response.json();
    console.log(note)
    setNotes(notes.concat(note));
  };

  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    // Api Call
    const response = await fetch(`${host}/api/notes//updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem("authToken") 
      },
      body: JSON.stringify({title, description, tag}),
    });

    const json= response.json();
    console.log(json)
  

    let newNotes=JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      const element=newNotes[index]
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
     
    }
   
    setNotes(newNotes)
  };

  //Delete a Note
  const deleteNote = async(id) => {
    //TODO: Api Call
    
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem("authToken") 
      }
    });

    const json= await response.json();
    console.log(json)
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
    console.log("Deleting a Note");
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, editNote ,getNotes}}>
      {props.children}
    </NotesContext.Provider>
  );
};
export default NotesState;
