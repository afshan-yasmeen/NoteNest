import React, { useContext } from "react";
import NotesContext from "../context/notes/NotesContext";

const Noteitem = ({ note, updateNote ,showAlert}) => {
    const {  deleteNote,editNote } = useContext(NotesContext);

    
   

    return (
        <div className="note-container">
            <div
                className="note-card"
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0px 6px 15px rgba(0, 0, 0, 0.1)";
                }}
            >
                <h5 className="note-title">{note.title}</h5>
                <h6 className="note-tag">{note.tag}</h6>
                <p className="note-description">{note.description}</p>
                <a href="#" className="note-date">
                    {note.date}
                </a>
                <div className="note-actions">
                    <i className="fa-solid fa-trash" onClick={()=>{<>{deleteNote(note._id)} {showAlert("Note is deleted successfully", "success")}</>}} style={{ cursor: "pointer" }}></i>
                    <i className="fa-solid fa-pen-to-square" onClick={()=>{updateNote(note)}}></i>
                </div>
            </div>
        </div>
    );
};

export default Noteitem;
