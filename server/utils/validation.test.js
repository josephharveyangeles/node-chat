const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    expect(isRealString(12454)).toBeFalsy();
  });

  it('should reject whitespace-only strings', () => {
    expect(isRealString('   ')).toBeFalsy();
  });

  it('should allow strings with non-space characters', () => {
    expect(isRealString(' hey yo ')).toBeTruthy();
  });
});