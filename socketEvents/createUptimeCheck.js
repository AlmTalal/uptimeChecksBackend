const { validateUptimeCheck, UptimeCheck } = require("../models/uptimeCheck");

module.exports = (socket) => {
  socket.on("createUptimeCheck", async (newUptimeCheck) => {
    //Validates the newUptimeCheck
    const error = validateUptimeCheck(newUptimeCheck);
    //If there is an error it emit it an return
    if (error) {
      socket.emit("CreateUptimeCheckStatus", error.details[0].message);
      return;
    }

    //It tries to create an uptime check, if it's succesfull emits true else emits false
    try {
      const uptimeCheck = new UptimeCheck({
        chekedUrl: newUptimeCheck.chekedUrl,
        checkedId: newUptimeCheck.checkedId,
        name: newUptimeCheck.name,
        checkedStatus: newUptimeCheck.checkedStatus,
      });
      await uptimeCheck.save();
      socket.emit("CreateUptimeCheckStatus", true);
    } catch (error) {
      socket.emit(
        "CreateUptimeCheckStatus",
        "Sorry, there was an error. Please retry"
      );
    }
  });
};
