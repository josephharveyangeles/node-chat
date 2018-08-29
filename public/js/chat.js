const socket = io();

const app = new Vue({
  el: '#app',
  data: {
    welcome: 'Welcome to chat app!',
    message: '',
    users: [],
    messages: [],
    disableButtons: false
  },
  computed: {
    locationButtonName () {
      return this.disableButtons ? 'Sending location..' : 'Send Location';
    }
  },
  methods: {
    updateUserList(data) {
      this.users = data;
    },
    sendMessage() {
      socket.emit('createMessage', {
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
      this.messages.push({
        from: message.from,
        timestamp,
        text: message.text
      });
    },
    receiveLocationMessage(data) {
      const timestamp = moment(data.timestamp).format('h:mm a');
      this.messages.push({
        from: data.from,
        timestamp,
        text: `<a href="${data.url}" target="_blank">My Location</a>`
      });
    }
  }
});

socket.on('connect', function () {
  const roomParams = deparam(window.location.search);
  socket.emit('join', roomParams, function(err) {
    if (err) {
      alert(err);
      return window.location.href = "/";
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from the server.')
});

socket.on('newMessage', function (data) {
  app.receiveMessage(data);
  scrollToBottom();
});

socket.on('updateUserList', function (data) {
  app.updateUserList(data);
});

socket.on('newLocationMessage', function(data) {
  app.receiveLocationMessage(data);
  scrollToBottom();
});

function scrollToBottom() {
  const messages = document.getElementById('messages');
  const newMessage = messages.lastChild;

  const clientHeight = messages.clientHeight;
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.scrollHeight;
  if (!newMessage) {
    return;
  }
  const newMessageHeight = newMessage.getBoundingClientRect().height;
  const secondToLastChild = messages.childNodes[messages.childElementCount - 2];
  const secondToLastHeight = secondToLastChild ? secondToLastChild.getBoundingClientRect().height : 0;

  if (clientHeight +
      scrollTop + 
      newMessageHeight +
      secondToLastHeight
      >= scrollHeight) {
        setTimeout(() => {
          messages.scrollTop = scrollHeight;
        }, 200);

  }
}