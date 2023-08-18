const authorize = require("../../middlewares/auth");
const {
  validateUptimeCheck,
  UptimeCheck,
} = require("../../models/uptimeCheck");

module.exports = (socket) => {
  socket.on("createUptimeCheck", async (newUptimeCheck, token, callback) => {
    //Authorize
    if (!authorize(token)) {
      callback("error", "You are not authorized to do this operation");
      return;
    }
    //Validates the newUptimeCheck
    const error = validateUptimeCheck(newUptimeCheck);
    //If there is an error it emit it an return
    if (error) {
      callback("error", error.details[0].message);
      return;
    }

    //It tries to create an uptime check, if it's succesfull emits "success" else emits "error"
    try {
      const uptimeCheck = new UptimeCheck({
        checkedUrl: newUptimeCheck.checkedUrl,
        checkedId: newUptimeCheck.checkedId,
        name: newUptimeCheck.name,
        checkedStatus: newUptimeCheck.checkedStatus,
      });
      await uptimeCheck.save();
      callback("success", "Created the uptime check");
    } catch (error) {
      callback("error", "Sorry, there was an error. Please retry");
    }
  });
};
