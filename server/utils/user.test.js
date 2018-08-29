const expect = require('expect');
const Users = require('./users');

describe('Users', () => {
  let seedUsers;
  beforeEach(() => {
    seedUsers = new Users([
      {
        id: 1,
        name: 'Tesla',
        room: 'Engineering Course'
      },
      {
        id: 2,
        name: 'Feynman',
        room: 'Physics Course'
      },
      {
        id: 3,
        name: 'Curie',
        room: 'Physics Course'
      }
    ]);
  });

  it('should add a new user', () => {
    const users = new Users();
    users.addUser({id: 1, name: 'Joseph', room: 'Classroom'});
    expect(users.users.length).toEqual(1);
  });

  it('should get users on a room', () => {
    const result = seedUsers.getUserList('Physics Course');
    expect(result.length).toEqual(2);
    expect(result).toEqual(['Feynman', 'Curie']);
  });

  it('should remove a user', () => {
    expect(seedUsers.users.length).toEqual(3);
    const removed = seedUsers.removeUser(1);
    expect(seedUsers.users.length).toEqual(2);
    expect(removed.id).toEqual(1);
  });

  it('shold not remove a user that is not included in the seed', () => {
    expect(seedUsers.users.length).toEqual(3);
    const removed = seedUsers.removeUser(4);
    expect(seedUsers.users.length).toEqual(3);
    expect(removed).not.toBeDefined();
  });

  it('should find user', () => {
    expect(seedUsers.getUser(1).name).toEqual('Tesla');
  });

  it('should handle non-existing user', () => {
    expect(seedUsers.getUser(4)).not.toBeDefined();
  });
});