import React, { useContext, useState } from "react";
import NotesContext from "../context/notes/NotesContext";
const AddaNote = (props) => {
  const { addNote } = useContext(NotesContext);
  const [note, setnote] = useState({ title: "", description: "", tag: "" });
  const [errors, setErrors] = useState({ title: "", description: "", tag: "" });
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
    addNote(note.title, note.description, note.tag);
    props.showAlert("Note is added successfully!", "success");
    setnote({ title: "", description: "", tag: "" });
  };

  const onChange = (e) => {
    setnote({ ...note, [e.target.name]: e.target.value });
  };
  return (
    <div className="container my-4">
      {/* Add your Note  */}
      <h2 className="text-center mb-4">Add your note</h2>
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
            aria-describedby="titleHelp"
            placeholder="Enter title"
            name="title"
            value={note.title}
            onChange={onChange}
          />

          {errors.title && (
            <small className="text-danger">*{errors.title}</small>
          )}
          <br />
          <small id="titleHelp" className="form-text text-muted">
            Please give an appropriate title for your note
          </small>
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
            value={note.description}
            onChange={onChange}
            rows="3"
          ></textarea>
          {errors.description && (
            <small className="text-danger">*{errors.description}</small>
          )}
          <br />
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
            aria-describedby="tagHelp"
            placeholder="Enter tag"
            value={note.tag}
            onChange={onChange}
          />
          {errors.tag && <small className="text-danger">*{errors.tag}</small>}
          <br />
          <small id="tagHelp" className="form-text text-muted">
            Please give an appropriate tag for your note
          </small>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          onClick={handleClick}
        >
          Add a Note
        </button>
      </form>
    </div>
  );
};

export default AddaNote;
