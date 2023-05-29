import { useState, useEffect } from 'react';
import './chatUser.css';
import axios from 'axios';
import DefaultProfilePic from '../../images/noPic.png'

export default function ChatUser({chat, cUser}) {
  // get the friend's information from the chat object
  const [friend, setFriend] = useState({});

  useEffect(() => {
    // get the Id of the friend from the chat object
    const friendId = chat.users.find((sUser) => sUser !== cUser._id);

    // get the friend's information from the database
    const getFriend = async () => {
      try {
        const res = await axios.get(`/users?userId=${friendId}`);
        setFriend(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }
    getFriend();
  }, [chat, cUser]);


  return (
    <div className="chatUser">
      <div className="chatUserWrapper">
        <div className="chatUserImgContainer">
          <img src={DefaultProfilePic} alt="" className="chatUserImg" />
        </div>
        <span className="chatUserName">{friend.username}</span>
      </div>
    </div>
  );
}