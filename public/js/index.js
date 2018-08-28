const socket = io();

const app = new Vue({
  el: '#app',
  data: {
    welcome: 'Welcome to chat app!',
    message: '',
    messages: [],
    disableButtons: false
  },
  computed: {
    locationButtonName () {
      return this.disableButtons ? 'Sending location..' : 'Send Location';
    }
  },
  methods: {
    sendMessage() {
      socket.emit('createMessage', {
        from: 'Frank',
        text: this.message
      }, () => {
        this.message = '';
      });
    },
    sendLocation() {
      if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
      }
      this.disableButtons = true;
      navigator.geolocation.getCurrentPosition(
        (position) =>  {
          socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          this.disableButtons = false;
        },
        (err) => { 
          alert('Unable to print location.'); 
          this.disableButtons = false;
        }
      );
    },
    receiveMessage(message) {
      const timestamp = moment(message.timestamp).format('h:mm a');
      const string = `${message.from} ${timestamp}: ${message.text}`;
      this.messages.push(string);
    },
    receiveLocationMessage(data) {
      const timestamp = moment(data.timestamp).format('h:mm a');
      const anchor = `${data.from} ${timestamp}: <a href="${data.url}" target="_blank">My Location</a>`;
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
