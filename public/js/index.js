const socket = io();

const app = new Vue({
  el: '#app',
  data: {
    welcome: 'Welcome to chat app!',
    message: '',
    messages: []
  },
  methods: {
    sendMessage() {
      console.log('your message ', this.message);
      
      socket.emit('createMessage', {
        from: 'Frank',
        text: this.message
      }, (data) => {
        // this.messages.push(`You: ${this.message}`);
        this.message = '';
      });
    },
    sendLocation() {
      if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
      }
      navigator.geolocation.getCurrentPosition(
        (position) => socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        (err) => alert('Unable to print location.')
      );
    },
    receiveMessage(message) {
      const string = `${message.from}: ${message.text}`;
      this.messages.push(string);
    },
    receiveLocationMessage(data) {
      const anchor = `${data.from}: <a href="${data.url}" target="_blank">My Location</a>`;
      this.messages.push(anchor);
    }
  }
});

socket.on('connect', function () {
  console.log('connected to server.');
});

socket.on('disconnect', function () {
  console.log('Disconnected from the server.')
});

socket.on('newMessage', function (data) {
  console.log('newMessage', data);
  app.receiveMessage(data);
});

socket.on('newLocationMessage', function(data) {
  app.receiveLocationMessage(data);
});

// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'HI'
// }, function(data) {
//   console.log('Got it', data);
// })