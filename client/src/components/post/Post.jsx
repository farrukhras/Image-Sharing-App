import { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css'
import { Link } from 'react-router-dom';
import DefaultProfilePic from '../../images/noPic.png'

function Post({post}) {
  const [user, setUser] = useState({});

  // get the base64 image
  let base64String = post.img.split(",");
  
  // get a user from the database
  useEffect(() => {
    // async function to fetch the user
    const fetchUser = async () => {
      // get the user from the database
      const res = await axios.get(`/users/?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post]);

  return (
    <div className="postContainer">
      <div className="postWrapper">
        <div className="postTop">
          <Link to={`profile/${user.username}`}>
            <img className="userProfileImg" src={user.profilePicture || DefaultProfilePic} alt="Profile" />
          </Link>
          <span className="postUsername">{user.username}</span>
        </div>
        <hr className="postHr" />
        <div className="postCenter">
          <img className="postImg" src={`data:image/jpeg;base64,${base64String[1]}`} alt="Post"/>
        </div>
        <div className="postBottom">
          <span className="postDescription">{post.desc}</span>
        </div>
      </div>
    </div>
  )
}

export default Post;