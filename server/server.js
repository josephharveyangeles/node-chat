const path = require('path');
const http = require('http'); // explore using http2 as well
const express = require('express');
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const Users = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(publicPath));

const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

io.on('connection', (socket) => {
  console.log('New user connected.');
  /**
   * io:        is the ServerSocket. once a user visits our server, you are already 
   *          connected on the serverSocket.
   * 
   * socket:    ClientSocket. Once a client connects, a communication socket is established
   *          that flows bi-directional, server - client, clien - server.
   * 
   * io.emit:    Sends a message throughout the server. To all connected clients, to all visitors.
   * 
   * socket.emit:  Sends a message to the connected client. This is partly confusing.
   *          Remember that, everytime you visit a server you already have established a one-to-one
   *          session. The socket is your communication medium, each connection has a separate socket
   *          to talk to the server with. Hence, socket.emit is one-to-one. Server to client.
   * 
   * socket.broadcast.emit:   Sends a message to all clients under the same io connection or
   *          ServerSocket except yourself. 'Yourself', yes, remember that each client has it's own
   *          session with the server? Whatever you do in that session does not interfere with
   *          the other connected clients. When your server do a socket.broadcast.emit, it sends a 
   *          message to all other connected to the server except yourself.
   * 
   * socket.broadcast.to(room): Sends a message to all in the room except yourself. Room is a separate
   *          concept altogether. SocketServers can spawn off rooms, which is a separate space, 
   *          another layer of separation between connected clients. 
   */

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser({
      id: socket.id,
      name: params.name,
      room: params.room
    });
    callback();

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage({ // emit this message to the user that connected
      from: 'Admin',
      text: 'Welcome to the chat app.'
    }));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage({
      from: 'Admin',
      text: `${params.name} joined the chat room`
    }));


  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage({
        from: 'Admin',
        text: `User ${user.name} has left`
      }));
    }
  });

  socket.on('createMessage', (data, callback) => {
    io.emit('newMessage', generateMessage(data)); // emit on every connected socket, where 1 socket = 1 client
    callback();
    // socket.broadcast.emit('newMessage', { // send the message on all except the source
    //   ...data,
    //   timestamp: new Date().getTime()
    // });

  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage({from: 'admin', ...coords}));
  })

});


server.listen(PORT, () => {
  console.log(`Server is up running on PORT: ${PORT}`);
})