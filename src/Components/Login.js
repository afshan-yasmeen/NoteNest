import React,{useState} from "react";
import {useNavigate} from "react-router-dom"

const Login = (props) => {
  const host = "http://localhost:5000";
  let navigate= useNavigate();
  const [data, setdata] = useState({ email: "", password: "" });
  const [error, seterror] = useState({email:"",password:""})


  const handleSubmit = async (event) => {
    let email=data.email;
    let password=data.password;
    event.preventDefault(); // Prevents page reload
    // Check ValidationErrors 
    let validationErrors={email:"", password:""};
    let hasError=false;
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
     seterror({ email: "", password: ""});
    // Api Call
    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();

    if(json.success){
      //Save the auth token in local storage
      localStorage.setItem("authToken", json.authToken);
      navigate("/")
      props.showAlert("Login Successfull!", "success")
    }
    else{
    console.log(json);
    props.showAlert("Invalid Credentials!", "danger")
    }
    setdata({ email: "", password: "" })
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
           {error.email && (
            <small className="text-danger">*{error.email}</small>
          )}
          <br/>
          <small
            id="emailHelp"
            className="form-text text-muted"
            style={{ fontSize: "0.85em", color: "#6c757d" }}
          >
            We'll never share your email with anyone else.
          </small>
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

export default Login;
