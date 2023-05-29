import './message.css';
import moment from 'moment';
import DefaultProfilePic from '../../images/noPic.png';

function Message({message, personalMessage}) {
  return (
    <div className={personalMessage ? "message personalMessage" : "message"}>
      <div className="messageTop">
        <img src={DefaultProfilePic} alt="" className="messageImg" />
        <p className="messageText">
          {message.message}
        </p>
      </div>
      <div className="messageBottom">
        {moment(message.createdAt).fromNow()}
      </div>
    </div>
  )
}

export default Message;