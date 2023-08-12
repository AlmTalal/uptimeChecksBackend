const { UptimeCheck } = require("../models/uptimeCheck");

module.exports = (socket) => {
  socket.on("GetUptimeChecks", async () => {
    try {
      const uptimeChecks = await UptimeCheck.find();
      socket.emit("SendedUptimeChecks", uptimeChecks);
    } catch (error) {
      socket.emit("SendedUptimeChecks", "Sorry, Something went wrong");
    }
  });
};
