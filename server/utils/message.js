const generateMessage = ({from, text, timeStamp = new Date().getTime()}) => {
  return {
    from,
    text,
    timeStamp
  }
}

const generateLocationMessage = ({from, latitude, longitude, timeStamp = new Date().getTime()}) => {
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