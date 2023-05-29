import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DefaultProfilePic from '../../images/noPic.png'
import './newPost.css'

export default function NewPost({pageType}) {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const {user} = useSelector((state) => state.user);

  // get the base64 image
  let base64String = user.profilePicture.split(",");

  let navigate = useNavigate();

  function handleDescChange(e) {
    setDesc(e.target.value);
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  // handle form submit
  async function handleFormSubmit(e) {
    e.preventDefault();
    const nPost = {
      userId: user._id,
      desc: desc,
      img: file
    }

    if (file) {
      // create a new form data
      const data = new FormData();
      const fileName = Date.now() + "__" + file.name;

      // append the file to the form data by changing the name of the image file to be stored in the server
      data.append("name", fileName);
      data.append("file", file);
      nPost.img = fileName;

      // send the form data to the server
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }

    try {
      // send the new post to the server
      await axios.post("/posts", nPost);

      if (pageType === "profile") {
        navigate("/");
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="newPostContainer">
      <div className="newPostWrapper">
        <div className="newPostTop">
        <img className="newPostProfileImg" src={user.profilePicture ? `data:image/jpeg;base64,${base64String[1]}` : DefaultProfilePic} alt="Profile" />
          <input placeholder="Create a new post here..." className="newPostInput" onChange={handleDescChange} style={{outline: "none"}}/>
        </div>
        <hr className="newPostHr" />
        <form className="newPostBottom" onSubmit={handleFormSubmit}>
          <div className="newPostOption">
            <input style={{outline: "none"}} type="file" id="file" accept=".png,.jpeg,.jpg" onChange={handleFileChange}/>
          </div>
          <button className="newPostButton" type="submit">Post</button>
        </form>
      </div>
    </div>
  )
}