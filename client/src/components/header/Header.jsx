import './header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import DefaultProfilePic from '../../images/noPic.png'
import LogoutIcon from '@mui/icons-material/Logout';
import { resetState } from '../../pages/userSlice';
import { Tooltip } from '@mui/material';

export default function Header() {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);

  let navigate = useNavigate();

  // get the base64 image
  let base64String = user.profilePicture.split(",");

  // function to handle logout
  function handleLogout() {
    // remove the user from the local storage
    localStorage.removeItem("user");

    // reset the state
    dispatch(resetState());

    navigate("/register");
  }

  return (
    <div className="headerContainer">
      <div className="headerLeft">
        <Link to="/" style={{textDecoration: "none"}}>
          <span style={{color: "whitesmoke"}}>Image Sharing App</span>
        </Link>
      </div>
      <div className="headerRight">
        <Link to='/chat'  style={{textDecoration: "none", marginRight: "15px"}}>
          <span style={{color: "whitesmoke"}}>Chat</span>
        </Link>
        <Tooltip title={user.username}>
          <Link to={`/profile/${user.username}`}>
            <img className="profileImg" src={user.profilePicture ? `data:image/jpeg;base64,${base64String[1]}` : DefaultProfilePic} alt="Profile Icon"/>
          </Link>
        </Tooltip>

        <Tooltip title="Logout">
          <button className="headerLogoutButton" onClick={handleLogout}>
            <LogoutIcon />
          </button>
        </Tooltip>

      </div>
    </div>
  )
}