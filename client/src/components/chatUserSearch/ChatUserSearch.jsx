import './chatUserSearch.css'
import { useEffect, useState } from 'react'
import DefaultProfilePic from '../../images/noPic.png'
import axios from 'axios';

export default function UserSearch({onlineUsers, currUser, setCurrChat }) {
  const [myFollowings, setMyFollowings] = useState([]); // state to store the current user's followings
  const [myOnlineFollowings, setMyOnlineFollowings] = useState([]); // state to store the current user's online followings

  // get the current user's followings from the database
  useEffect(() => {
    const getFollowings = async () => {
      try {
        // get the followings from the database
        const res = await axios.get("/users/followers/" + currUser?._id);
        // set the followings
        setMyFollowings(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getFollowings();
  }, [currUser]);

  // get the current user's online followings
  useEffect(() => {
    // filter the followings to get the online followings only and set the online followings
    setMyOnlineFollowings(myFollowings.filter((following) => onlineUsers.includes(following._id)));
  }, [myFollowings, onlineUsers]);

  // function to convert an image to base64
  function convertImageFormat(convertUser) {
    // convert the image to base64
    let base64String = convertUser.profilePicture.split(",");
    // return the base64 string
    return base64String[1];
  }

  async function handleClick(following) {
    // fetch the chat between the current user and the following
    try {
      // get the chat from the database
      const res = await axios.get(`/chats/find/${currUser._id}/${following._id}`);

      // if the chat does not exist
      if (res.data === null) {
        // create a new chat
        const newChat = {
          senderId: currUser._id,
          receiverId: following._id,
        };

        // create the chat in the database
        const res = await axios.post("/chats", newChat);
        // set the current chat
        setCurrChat(res.data);
        return;
      }

      // set the current chat
      setCurrChat(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='onlineContainer'>
      {
        myOnlineFollowings.length > 0 ? (
          <div className='onlineContainerWrapper'>
            { 
              myOnlineFollowings.map((user) => (
                <div className="following" onClick={() => handleClick(user)}>
                  <img src={user.profilePicture ? `data:image/jpeg;base64,${convertImageFormat(user)}` : DefaultProfilePic} alt="" className="followingImg" />
                  <span className="followingName">{user.username}</span>
                </div>
              ))
            }
          </div>
        ) : (
          <span className="noOnlineFollowings">No users online!</span>
        )
      }
    </div>
  )
}