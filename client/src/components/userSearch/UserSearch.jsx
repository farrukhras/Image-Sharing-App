import './userSearch.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DefaultProfilePic from '../../images/noPic.png'
import axios from 'axios';

export default function UserSearch() {
  const user = useSelector((state) => state.user.user);
  const [followingsList, setFollowingsList] = useState([]);
  const [searchUserName, setSearchUserName] = useState("");
  const [error, setError] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // async function to fetch the followings of a particular person 
    const fetchFollowings = async () => {
      try {
        // get the followings from the database using axios
        const res = await axios.get("/users/followers/" + user?._id);
        setFollowingsList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    // call the async function
    fetchFollowings();
  }, [user]);

  // function to convert an image to base64
  function convertImageFormat(convertUser) {
    // convert the image to base64
    let base64String = convertUser.profilePicture.split(",");
    // return the base64 string
    return base64String[1];
  }

  // handle user search submit
  function handleUserSearchSubmit(e) {
    e.preventDefault();

    // check if the searchUserName is empty
    if (searchUserName === "") {
      setErrorMessage("Please enter a username!");
      setError(true);
      return;
    }

    // do not search for the a user if the current user is already following the searchedUser
    if (followingsList.some((following) => following.username === searchUserName)) {
      setErrorMessage("You are already following this user!");
      setError(true);
      return;
    }

    // do not search for the a user if the current user is the searchedUser
    if (searchUserName === user.username) {
      setErrorMessage("You cannot search for yourself!");
      setError(true);
      return;
    }

    // async function to search for a user
    const searchUser = async () => {
      try {
        // get the user from the database
        const res = await axios.get(`/users/?username=${searchUserName}`);
        // set the searched user
        setSearchedUser(res.data);
        // set the error to false
        setError(false);
      } catch (error) {
        // set the error to true
        setSearchedUser(null);
        // set the error to true
        setError(true);
        // set the error message
        setErrorMessage("No users found!");
        console.log(error);
      }
    }

    // call the async function
    searchUser();
  }

  return (
    <div className='searchContainer'>
      <form className="newPostBottom" onSubmit={handleUserSearchSubmit}>
        <div className='searchWrapper'>
          <input 
            type="text" 
            placeholder="Search for a user" 
            className='userSearch' 
            onChange={(event) =>
              setSearchUserName(event.target.value)
            }
          />
          <button className="userSearchButton" type="submit">Search</button>
        </div>
      </form>
      
      {/* UI to display the user searched from the search bar, also display a heading to represent the searched user */}
      {searchedUser && (
        <div className='usersCard'>
          <div className="followingsList">
            <span className="subHeadingName">Searched Users</span>
            <Link to={"/profile/" + searchedUser.username} style={{textDecoration: "none", color: "black"}}>
              <div className="following">
                <img src={searchedUser.profilePicture ? `data:image/jpeg;base64,${convertImageFormat(searchedUser.profilePicture)}` : DefaultProfilePic} alt="" className="followingImg" />
                <span className="followingName">{searchedUser.username}</span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* UI to display the error message */}
      {error && (
        <div className="errorWrapper">
          <span className="errorMessage">{errorMessage}</span>
        </div>
      )}

      {/* UI to display the followings of the user */}
      {followingsList.length !== 0 &&
        <div className="followingsList">
          <span className="subHeadingName">Followings</span>
          {followingsList.map((following) => (
            <Link key={following._id} to={"/profile/" + following.username} style={{textDecoration: "none", color: "black"}}>
              <div className="following">
                <img src={following.profilePicture ? `data:image/jpeg;base64,${convertImageFormat(following.profilePicture)}` : DefaultProfilePic} alt="" className="followingImg" />
                <span className="followingName">{following.username}</span>
              </div>
            </Link>
          ))}        
        </div>
      }
    </div>
  )
}