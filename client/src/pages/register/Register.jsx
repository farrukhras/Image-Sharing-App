import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link } from "react-router-dom";
import "./register.css"

export default function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  // get the navigate function from the react router dom
  let navigate = useNavigate();

    // handle username change
  function handleUserNameChange(event) {
    setUserName(event.target.value);
  }

    // handle email change
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

    // handle password change
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

    // handle password again change
  function handlePasswordAgainChange(event) {
    setPasswordAgain(event.target.value);
  }

  // handle form submit
  async function handleFormSubmit(event) {
    event.preventDefault();
    // if the passwords do not match, display an error message
    if(passwordAgain !== password) {
      alert("Passwords do not match");
    } else { // if the passwords match, make a post request to the server to register
      // create a user object
      const user = {username: userName, email: email, password: password};
      try {
      
        // make a post request to the server to register
        await axios.post("/auth/register", user);
        // redirect to the login page
        navigate("/login");
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="loginContainer">
      <form className="loginBox" onSubmit={handleFormSubmit}>
        <div className="appName">Image Sharing App</div>
        <input className="loginInput" required type="text" placeholder="Username" onChange={handleUserNameChange} />
        <input className="loginInput" required type="email" placeholder="Email" onChange={handleEmailChange} />
        <input className="loginInput" required type="password" placeholder="Password" onChange={handlePasswordChange} />
        <input className="loginInput" required type="password" placeholder="Type Password Again" onChange={handlePasswordAgainChange} />
        <button className="loginButton">Register</button>
      </form>
      <div className="registerBox">
        <span className="registerText">Already have an account!</span>
        <Link to="/login">
          <button className="registerButton">Log in</button>
        </Link>
      </div>
    </div>  
  )
}