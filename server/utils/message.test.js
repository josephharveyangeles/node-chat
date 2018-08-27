const expect = require('expect');
const {generateMessage} = require('./message');

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