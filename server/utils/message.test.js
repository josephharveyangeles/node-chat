const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {

  it('should generate the correct message object', () => {
    const message = {
      text: 'Hi',
      from: 'Me'
    }
    const expected = generateMessage(message);
    expect(expected).toMatchObject(message);
    expect(expected.timeStamp).not.toBeNull();
    expect(typeof expected.timeStamp).toEqual('number');
  });

});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const payload = {
      from: 'admin',
      latitude: 0,
      longitude: 1
    };
    const expectedURL = `https://www.google.com/maps?q=${payload.latitude},${payload.longitude}`;
    const actualData = generateLocationMessage(payload);
    expect(actualData.from).toEqual(payload.from);
    expect(actualData.timeStamp).not.toBeNull();
    expect(actualData.url).toEqual(expectedURL);
  });
});