let users = [];

const addUser = ({ id, user, room }) => {
  user = user.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!user || !room) {
    return { error: 'Name and room required' };
  }

  const existingUser = users.find(
    (e) => e.user === user && e.room === room
  );

  if (existingUser) {
    return { error: 'User already exists in this room' };
  }

  const response = { id, user, room };
  users.push(response);

  console.log('Current Users:', users);

  return { response };
};

const getUser = (id) => users.find((e) => e.id === id);

const getRoomUsers = (room) => users.filter((e) => e.room === room);

const removeUser = (id) => {
  const index = users.findIndex((e) => e.id === id);
  if (index >= 0) return users.splice(index, 1)[0];
};

module.exports = {
  addUser,
  getUser,
  removeUser,
  getRoomUsers,
};