class Users {

  constructor(users) {
    this.users = users || [];
  }

  addUser({id, name, room}) {
    const user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.users.splice(this.users.findIndex(u => u.id === user.id), 1);
      return user;
    }
  }

  getUser(id) {
    return this.users.find(user => user.id === id);
  }

  getUserList(room) {
    return this.users.filter(u => u.room === room)
                    .map(u => u.name);
  }

}

module.exports = Users