const isAuthorized = require("../../middlewares/auth");

module.exports = (socket) => {
  socket.on("updateUptimeCheck", (token, callback) => {
    const isAuthed = isAuthorized(token);
    callback(isAuthed);
  });
};
