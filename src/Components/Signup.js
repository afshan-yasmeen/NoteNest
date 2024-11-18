import React,{useState} from "react";
import {useNavigate} from "react-router-dom"

const Signup = (props) => {
  const host = "http://localhost:5000";
  let navigate= useNavigate();
  const [data, setdata] = useState({ name:"", email: "", password: "" });
  const [error, seterror] = useState({name:"", email:"",password:""})


  const handleSubmit = async (event) => {
    let name=data.name;
    let email=data.email;
    let password=data.password;
    event.preventDefault(); // Prevents page reload
    // Check ValidationErrors 
    let validationErrors={name:"", email:"", password:""};
    let hasError=false;
    if(name.length<3){
      if(name.length===0)
      {
        validationErrors.name="Name is required!";
      }
      else{
      validationErrors.name="Minimum 3 characters are required!";
      }
      hasError=true;
    }
    if(!email){
      validationErrors.email="Email is required";
      hasError=true;
    }
    if(password.length<5){
      if(password.length===0)
      {
        validationErrors.password="Password is required!";
      }
      else{
      validationErrors.password="Minimum 5 characters are required!";
      }
      hasError=true;
    }

    if (hasError) {
      seterror(validationErrors);
      return;
    }

       
     //clear errors after validation is passed
     seterror({name:"", email: "", password: ""});
    // Api Call
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name, email, password }),
    });
    const json = await response.json();

   if(json.error){
    console.log(json.error);
    props.showAlert("Invalid Credentials", "danger")
   }

   if(json.success){
    console.log(json.authToken ,json.success);
    localStorage.setItem("authToken", json.authToken);
    navigate("/")
    setdata({ name:"", email: "", password: "" })
    props.showAlert("Registration Successfull!", "success")
   }
   
   
  };

  const onChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: 30,
          maxWidth: 400,
          width: "100%",
          margin: "auto",
        }}
      >
         <div className="form-group" style={{ marginBottom: 15 }}>
          <label
            htmlFor="name"
            style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}
          >
            Name
          </label>
          <input
            type="name"
            className="form-control"
            id="name"
            aria-describedby="emailHelp"
            placeholder="Enter name"
            name="name"
            value={data.name}
            onChange={onChange}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ced4da",
              transition: "border-color 0.3s ease",
            }}
          />
           {error.name && (
            <small className="text-danger">*{error.name}</small>
          )}
        </div>
        <div className="form-group" style={{ marginBottom: 15 }}>
          <label
            htmlFor="email"
            style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}
          >
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            name="email"
            value={data.email}
            onChange={onChange}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ced4da",
              transition: "border-color 0.3s ease",
            }}
          />
            <small
            id="emailHelp"
            className="form-text text-muted"
            style={{ fontSize: "0.85em", color: "#6c757d" }}
          >
            We'll never share your email with anyone else.
          </small>
           {error.email && (
            <small className="text-danger">*{error.email}</small>
          )}
          <br/>
        
        </div>
        <div className="form-group" style={{ marginBottom: 15 }}>
          <label
            htmlFor="password"
            style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}
          >
            Password
          </label>
          <input
            name="password"
            value={data.password}
            onChange={onChange}
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ced4da",
              transition: "border-color 0.3s ease",
            }}
           />
            {error.password && (
            <small className="text-danger">*{error.password}</small>
          )}
          <br/>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#007bff",
            border: "none",
            color: "white",
            borderRadius: 4,
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Signup;
