import React, { useContext, useEffect, useRef, useState } from "react";
import NotesContext from "../context/notes/NotesContext";
import AddaNote from "./AddaNote";
import Noteitem from "./Noteitem";
import {useNavigate} from "react-router-dom";

const Notes = (props) => {
  const { notes, getNotes } = useContext(NotesContext);
  const { editNote } = useContext(NotesContext);
  const [note, setnote] = useState({ title: "", description: "", tag: "" });
  const [errors, setErrors] = useState({ title: "", description: "", tag: "" });
  let navigate=useNavigate();
  useEffect(() => {
    if(localStorage.getItem("authToken") ){
      getNotes();
    }
    else{
      navigate("/login")
    }
    // eslint-disable-next-line
  }, []);

  const UpdateNote = (note) => {
    ref.current.click();
    setnote(note);
  };

  const ref = useRef(null);
  const refClose = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    let validationErrors = { title: "", description: "", tag: "" };
    let hasErrors = false;

    if (note.title.length < 3) {
      validationErrors.title = "Title must be at least 3 characters";
      hasErrors = true;
    }

    if (note.description.length < 5) {
      validationErrors.description = "Description must be atleast 5 characters";
      hasErrors = true;
    }

    if (note.tag.length < 1) {
      validationErrors.tag = "Tag must be atleast 1 character";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

    //clear errors after validation is passed
    setErrors({ title: "", description: "", tag: "" });
    editNote(note._id, note.title, note.description, note.tag);
    props.showAlert("Updated Successfully!", "success")
    refClose.current.click(); // Close the modal after saving
  };

  const onChange = (e) => {
    setnote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddaNote  showAlert={props.showAlert}/>

      <>
        {/* Modal */}

        {/* Button trigger modal */}
        <button
          type="button"
          ref={ref}
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style={{ display: "none" }}
        ></button>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Edit a Note
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={refClose} // Reference to close button
                />
              </div>
              <div className="modal-body">
                <form
                  className="p-4 rounded shadow-sm bg-light"
                  style={{ maxWidth: "600px", margin: "0 auto" }}
                >
                  <div className="form-group mb-3">
                    <label htmlFor="title" className="form-label fw-bold">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      placeholder="Enter title"
                      name="title"
                      onChange={onChange}
                      value={note.title}
                    />
                    {errors.title && (
                      <small className="text-danger">*{errors.title}</small>
                    )}
                    <br />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="description" className="form-label fw-bold">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      id="description"
                      placeholder="Description"
                      onChange={onChange}
                      rows="3"
                      value={note.description}
                    ></textarea>
                    {errors.description && (
                      <small className="text-danger">
                        *{errors.description}
                      </small>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="tag" className="form-label fw-bold">
                      Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tag"
                      name="tag"
                      placeholder="Enter tag"
                      onChange={onChange}
                      value={note.tag}
                    />
                     {errors.tag && <small className="text-danger">*{errors.tag}</small>}
          <br />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleClick}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </>

      <div className="container my-5">
        <h2 className="text-center mb-4">Your Notes</h2>
        <div className="row g-4">
          {notes && notes.length > 0 ? (
            notes.map((note) => (
              <div className="col-md-4" key={note._id}>
                <Noteitem note={note} updateNote={UpdateNote}  showAlert={props.showAlert}/>
              </div>
            ))
          ) : (
            <p className="text-muted text-center py-4 fs-5">
              No notes available. Add a note to get started!
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notes;
