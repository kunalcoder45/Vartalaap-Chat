// utils/connectedUsers.js

const onlineUsers = new Map(); // Map<userId, socketId>

function addOnlineUser(userId, socketId) {
  onlineUsers.set(userId, socketId);
}

function removeOnlineUser(socketId) {
  for (const [userId, sId] of onlineUsers.entries()) {
    if (sId === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
}

function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}

function isUserOnline(userId) {
  return onlineUsers.has(userId);
}

module.exports = {
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
  isUserOnline
};
