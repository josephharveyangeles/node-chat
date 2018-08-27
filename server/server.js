const path = require('path');
const http = require('http'); // explore using http2 as well
const express = require('express');
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(publicPath));


const server = http.createServer(app);
const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('New user connected.');

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  setInterval(() => {
    socket.emit('newMessage', {
      from: 'me',
      timestamp: 'timestamp',
      text: 'from me to you.'
    });
  }, 2000);

  socket.on('createMessage', (data) => {
    console.log('createMessage:', JSON.stringify(data, undefined, 2));
  })

});


server.listen(PORT, () => {
  console.log(`Server is up running on PORT: ${PORT}`);
})