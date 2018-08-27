const generateMessage = ({from, text, timeStamp = new Date().getTime()}) => {
  return {
    from,
    text,
    timeStamp
  }
}

module.exports = {
  generateMessage
}