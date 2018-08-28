const moment = require('moment');

const generateMessage = ({from, text, timeStamp = moment().valueOf()}) => {
  return {
    from,
    text,
    timeStamp
  }
}

const generateLocationMessage = ({from, latitude, longitude, timeStamp = moment().valueOf()}) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    timeStamp
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage
}