import React from 'react'
import { useState, useEffect, } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { followUser, unFollowUser } from '../../pages/userSlice'
import axios from 'axios'
import './profileSection.css'
import DefaultProfilePic from '../../images/noPic.png'

export default function ProfileSection({user}) {
  const {user: currentUser} = useSelector((state) => state.user);
  const [isFollowing, setIsFollowing] = useState(currentUser.followings.includes(user._id));
  const [postsCount, setPostsCount] = useState(0);
  const dispatch = useDispatch();

  // get the base64 image
  let base64String = user.profilePicture.split(",");

  useEffect(() => {
    const fetchPosts = async () => {
      // get the posts from the database
      const res = await axios.get(`/posts/profile/${user.username}`);
      setPostsCount(res.data.length)
    }
    fetchPosts();

    // check if the user is following the current user
    currentUser.followings.includes(user?._id) ? setIsFollowing(true) : setIsFollowing(false);
  }, [user, currentUser])


  async function handleFollowButtonClick () {
    try {
      // if the user is following the current user, unfollow the user
      if (isFollowing) {
        await axios.put(`/users/${user._id}/unfollow`, {userId: currentUser._id});
        dispatch(unFollowUser(user._id));
      } else { // if the user is not following the current user, follow the user
        await axios.put(`/users/${user._id}/follow`, {userId: currentUser._id});
        dispatch(followUser(user._id));
      }
    } catch (error) {
      console.log(error);
    }
    setIsFollowing(!isFollowing);
  }
  
  return (
    <>
        <div className="profileTop">
          <div className="profileTopLeft">
          <img src={user.profilePicture ? `data:image/jpeg;base64,${base64String[1]}` : DefaultProfilePic} alt="" className="profileUserImg" />
          </div>
          <div className="profileTopRight">
            <div className="profileTopRightTop">
              <span className="profileUserName">{user.username}</span>
              {user.username !== currentUser.username && (
                <button className="profileFollowBtn" onClick={handleFollowButtonClick}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
            <div className="profileTopRightCenter">
              <div className="postsCount">{postsCount} posts</div>
              <div className="followersCount">{user.followers ?user.followers.length : 0} followers</div>
              <div className="followingsCount">{user.followings ?user.followings.length : 0} following</div>
            </div>
            <div className="profileTopRightBottom">
              {user.desc}
            </div>
          </div>
        </div>
    </>
  )
}