const path = require('path');
const http = require('http'); // explore using http2 as well
const express = require('express');
const socketIO = require('socket.io')

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(publicPath));


const server = http.createServer(app);
const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('New user connected.');

  socket.emit('newMessage', generateMessage({ // emit this message to the user that connected
    from: 'Admin',
    text: 'Welcome to the chat app.'
  }));

  // socket.emit -> emits the message from one user to all connected except the user
  // io.emit -> emits the message to all connected
  // socket -> each client who visits the server, has a socket. All user access the same
  //    server, the server doesn't have a copy of all connected users
  //    what happens is that, there's a server-client relationship that is independent from
  //    all server-client relationship, everytime a user visits our server.
  socket.broadcast.emit('newMessage', generateMessage({
    from: 'Admin',
    text: 'A new user joined the chat room'
  }));

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  socket.on('createMessage', (data, callback) => {
    io.emit('newMessage', generateMessage(data)); // emit on every connected socket, where 1 socket = 1 client
    callback('This is from the server.');
    // socket.broadcast.emit('newMessage', { // send the message on all except the source
    //   ...data,
    //   timestamp: new Date().getTime()
    // });

  });

});


server.listen(PORT, () => {
  console.log(`Server is up running on PORT: ${PORT}`);
})