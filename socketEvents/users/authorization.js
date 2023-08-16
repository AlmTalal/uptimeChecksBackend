const isAuthorized = require("../../middlewares/auth");

module.exports = (socket) => {
  socket.on("hasAuthorization", async (token, callback) => {
    console.log("token");
    const isAuthed = isAuthorized(token);
    callback(isAuthed);
  });
};
