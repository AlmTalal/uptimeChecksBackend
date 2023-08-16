const User = require("../../models/user");

module.exports = (socket) => {
  socket.on("authUser", async (user, callback) => {
    const currentUser = await User.findOne({ userMail: user.mail });
    if (!currentUser) {
      return callback([false, null, "Invalid mail or password"]);
    }
    //If the user is right we generate the token, else we return errors
    else if (currentUser.password == user.password) {
      const token = currentUser.generateAuthToken();
      return callback([true, token, null]);
    } else {
      return callback([false, null, "Invalid mail or password"]);
    }
  });
};
