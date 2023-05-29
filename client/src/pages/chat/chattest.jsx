import './chat.css';
import Header from '../../components/header/Header';
import ChatUser from '../../components/chatUser/ChatUser';
import Message from '../../components/message/Message';
import OnlineUsers from '../../components/onlineUsers/OnlineUsers';
import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

function Chat() {
  // get the currently logged in user
  const {user} = useSelector((state) => state.user);
  
  // state to store the chats
  const [chats, setChats] = useState([]);
  
  // state to store the current chat
  const [currChat, setCurrChat] = useState(null);

  // state to store the messages
  const [messages, setMessages] = useState([]);

  // state to store the new message ==> new
  const [newMsg, setNewMsg] = useState('');
  
  // reference to the new message input field ==> new
  const newMsgRef = useRef(null);

  // reference to the socket
  const socket = useRef(); 
  
  // state to store the online users
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // state to store the new message from the socket
  const [socketMsg, setSocketMsg] = useState(null);

  // set up a socket connection to the server
  useEffect(() => {
    socket.current = io('ws://localhost:8900');

    // <----- Task 12 solution -----> 
    // get the new message from the socket
    socket.current.on('getMessage', (data) => {
      setSocketMsg({
        sender: data.senderId,
        message: data.message,
        createdAt: Date.now()
      });
    });
    // <----- Task 12 solution -----> 
  }, []);

  // add the user to the socket and get the online users
  useEffect(() => { 
    // add the user to the socket 
    socket.current.emit('addUser', user._id);

    // get the online users from the socket
    socket.current.on('getUsers', (users) => {
      // only keep the users that are in the current user's following list
      setOnlineUsers(
        user.followings.filter((following) => users.some((u) => u.userId === following))
      );
    });
  }, [user]);

  // <----- Task 12 solution -----> 
  // add the new message from the socket to the messages array
  useEffect(() => {
    socketMsg && currChat?.users.includes(socketMsg.sender) && setMessages(prev=>[...prev, socketMsg]);  
  }, [socketMsg, currChat]);
  // <----- Task 12 solution -----> 

  // get the chats from the database on page load for the currently logged-in user
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // get the chats from the database
        const res = await axios.get(`/chats/${user._id}`);
        setChats(res.data);
      }
      catch (err) {
        console.log(err);
      }
    };
    fetchChats();
  }, [user]);
  
  // get the messages from the database on page load for the currently selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // get the messages from the database
        const res = await axios.get(`/messages/${currChat._id}`);
        setMessages(res.data);
      }
      catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [currChat]);

  // function to handle the scrolling of the messages
  useEffect(() => {
    // scroll to the bottom of the messages
    newMsgRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  // function to handle the selection of a chat
  function handleChatSelect(sChat) {
    setCurrChat(sChat);
  }

  // function to handle the change in the message input field
  function handleMessageChange(event) {
    // set the new message to the value of the input field
    setNewMsg(event.target.value);
  }

  // function to handle the sending of a message
  async function handleMessageSend(event) {
    // prevent the page from reloading
    event.preventDefault();

    // send the new message to the database
    const message = {
      sender: user._id,
      message: newMsg,
      chatId: currChat._id
    };

    // <----- Task 12 solution -----> 
    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId: currChat.users.find((userTemp) => userTemp  !== user._id),
      message: newMsg
    });
    // <----- Task 12 solution -----> 

    try {
      // if the message is empty, don't send it
      if (newMsg === '') return;

      // send the message to the database
      const response = await axios.post('/messages', message);

      // add the new message to the messages array
      setMessages([...messages, response.data]);
      
      // clear the new message input field
      setNewMsg('');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Header />

      <div className="chat">
        <div className="chatMenu">
          {
            // display chats if there are any
            chats.length > 0 ? (
              <>
                <h3 className='columnTitle'>Chats</h3>
                {
                  chats.map((sChat) => (
                    <div key={sChat._id} onClick={() => handleChatSelect(sChat)}>
                      <ChatUser key={sChat._id} chat={sChat} cUser={user}/>
                    </div>
                  ))
                }
              </>
            ) : (
              <span className="noChats">No chats yet</span>
            )
          }
        </div>

        <div className="chatBox">
          <div className="chatBoxContainer">
            {
              // if there is a current chat, display the messages
              currChat ? (
                <>
                  <div className='chatBoxTop'>
                    {
                      messages.map((sMessage) => (
                        <div key={sMessage._id} ref={newMsgRef}>
                          <Message key={sMessage._id} message={sMessage} personalMessage={sMessage.sender === user._id}/>
                        </div>
                      ))
                    }
                  </div>
                  <div className="chatBoxBottom">
                    <textarea 
                      placeholder="Write something..." 
                      className="chatMessageInput" 
                      value={newMsg}
                      onChange={(event) => handleMessageChange(event)}
                    >
                    </textarea>
                    <button className="chatSubmitButton" onClick={handleMessageSend}>Send</button>
                  </div>
                </>
              ) : (
                <span className="defaultChatMessage">Please select a conversation to start a chat.</span>
              )
            }
          </div>
        </div>
        
        {/* chatOnline */}
        <div className='followedUsers'>
          <OnlineUsers />
        </div>
      </div>
    </>
    
  );
}

export default Chat;