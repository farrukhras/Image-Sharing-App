import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess } from "./pages/userSlice";

// Pages
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import Chat from "./pages/chat/Chat";

function App() {
  // Get the user from the redux store
  const {user} = useSelector((state) => state.user);

  const dispatch = useDispatch();

  // Check if the user is logged in or not
  useEffect(() => {
    // Get the user from local storage
    const loggedInUser = localStorage.getItem("user");
    // If the user is logged in then dispatch the loginSuccess action
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      dispatch(loginSuccess(foundUser));
    }
  }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        {/* If a user is logged in then go to the homepage otherwise the register page */}  
        <Route 
          exact 
          path="/" 
          element={user ? (<Home />) : (<Register />)} 
        />

        {/* If the user is on the login page and user is already logged in then go to the homepage otherwise the login page */}
        <Route  
          path="/login" 
          element={user ? (<Navigate replace to={"/"}/>) : (<Login />)} 
        />

        {/* If the user is on the register page and user is already logged in then go to the homepage otherwise the register page */}
        <Route  
          path="/register" 
          element={user ? (<Navigate replace to={"/"}/>) : (<Register />)} 
        />

        {/* create a route for "chat" when user logged in otherwise navigate to login page */}
        <Route 
          exact path="/chat" 
          element={<Chat />} 
        />

        <Route exact path="/profile/:username" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

