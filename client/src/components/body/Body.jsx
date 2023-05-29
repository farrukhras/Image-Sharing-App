import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

import NewPost from '../new_post/NewPost'
import Post from '../post/Post'
import UserSearch from '../userSearch/UserSearch'
import './body.css'

export default function Body({username, page}) {
  const [posts, setPosts] = useState([]);
  const {user} = useSelector((state) => state.user);

  // get posts from the database
  useEffect(() => {
    const fetchPosts = async () => {
      // get the posts from the database
      const res = username 
        ? await axios.get("/posts/profile/" + username) 
        : await axios.get("posts/timeline/" + user._id);
      setPosts(res.data);
    };

    fetchPosts();
  }, [username, user._id]);

  return (
    <div className='bodyContainer'>
      <div className="bodyWrapper">
        <div className='bodyLeftCenter'>
          {(!username || username === user.username) && <NewPost pageType={page}/>}
          {posts.map((postData) => (
            <Post key={postData._id} post={postData} />
          ))}
        </div>
        <div className='bodyRight'>
          {(!username || username === user.username) && <UserSearch />}
        </div>
      </div>
    </div>
  )
}