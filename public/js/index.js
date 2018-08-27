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
    receiveMessage(message) {
      const string = `${message.from}: ${message.text}`;
      this.messages.push(string);
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

// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'HI'
// }, function(data) {
//   console.log('Got it', data);
// })