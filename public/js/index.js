const socket = io();
socket.on('connect', function () {
  console.log('connected to server.');

  setInterval(function(){
    socket.emit('createMessage', {
      from: 'me',
      text: 'hey from client.'
    })
  }, 3000);
});

socket.on('disconnect', function () {
  console.log('Disconnected from the server.')
});

socket.on('newMessage', function (data) {
  console.log('newMessage', data);
});