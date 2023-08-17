const isAuthorized = require("../../middlewares/auth");

module.exports = (socket) => {
  socket.on("hasAuthorization", (token, callback) => {
    const isAuthed = isAuthorized(token);
    callback(isAuthed);
  });
};
