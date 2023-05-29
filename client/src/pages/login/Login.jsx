import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, loginFail } from "../userSlice";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";
import axios from "axios";
import "./login.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // get the dispatch function from the redux store
  const dispatch = useDispatch();

  // get the user from the redux store
  const user = useSelector(state => state.user);

  // make a post request to the server to login
  // if the login is successful, set the user in the redux store
  // if the login is not successful, display an error message
  async function login({email, password}) {
    try {
      // make a post request to the server to login
      const response = await axios.post("/auth/login", { email, password });

      // set the user in the redux store
      dispatch(loginSuccess(response.data));

      // store the user in the local storage
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.log(error)

      // dispatch an error message
      dispatch(loginFail(error.response.data.message))
    }
  }

  // handle email change
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  // handle password change
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  // handle form submit
  function handleFormSubmit(event) {
    event.preventDefault();
    login({email, password});
  }

  return (
    <div className="loginContainer">
      <form onSubmit={handleFormSubmit} className="loginBox">
        <div className="appName">Image Sharing App</div>
        <input className="loginInput" required type="email" placeholder="Email" onChange={handleEmailChange}/>
        <input className="loginInput" required minLength={8} type="password" placeholder="Password" onChange={handlePasswordChange}/>
        <button className="loginButton">{user.isFetching ? <CircularProgress color="white" size="20px"/> : "Log in"}</button>
        <span className="forgotPassword">Forgot password?</span>
      </form>
      <div className="registerBox">
        <span className="registerText">Don't have an account?</span>
        <Link to="/register">
          <button className="registerButton">Register</button>
        </Link>
      </div>
    </div>  
  )
}