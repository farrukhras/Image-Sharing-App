// create a socket.io instance
const io = require('socket.io')(8900, {
  cors: {
    origin: "http://localhost:3000",
  }
});

// list of users
let users = [];

// add user to the list
function addUser(userId, socketId) {
  // if user is not in the list, add it 
  !users.some(user => user.userId === userId) && users.push({ userId, socketId });
}

// listen for a connection
io.on('connection', socket => {
  console.log('New user connected');

  // this will be called when a user is added
  // take userId and socketId from user and add it to the list
  // send the list of users to the client
  // so that the client can display the list of users
  socket.on('addUser', userId => {
    // add user to the list
    addUser(userId, socket.id);
    // send the list of users to the client
    io.emit('getUsers', users);
  });

  // this will be called when a user sends a message
  // take senderId, receiverId and message from user
  // find the user that we want to send the message to
  // send the message to the user
  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    // find the user that we want to send the message to
    const user = users.find(user => user.userId === receiverId);
    // send the message to the user
    io.to(user.socketId).emit('getMessage', {
      senderId,
      message
    });
  });

  // when user disconnects
  // 
  socket.on('disconnect', () => {
    console.log('User disconnected');
    // remove user from the list
    users = users.filter(user => user.socketId !== socket.id);
    io.emit('getUsers', users);
  });
});
