require("dotenv").config({ path: require("find-config")("./.env") });
const mongoose = require("mongoose");
const socketServer = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

//Functions
const getCurrentUptimeChecks = require("./functions/getCurrentUptimeChecks");
const getMetrics = require("./functions/getMetrics");
const compareNewMetrics = require("./functions/compareNewMetrics");

//Socket events
const createUptimeCheck = require("./socketEvents/createUptimeCheck");
const getAllUptimeChecks = require("./socketEvents/getUptimeChecks");

//Connecting to mongoose
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
  } catch (error) {
    console.log(error);
  }
})();

(async () => {
  //every 60 seconds
  setInterval(async () => {
    let currentUptimeChecks = await getCurrentUptimeChecks();
    const newMetrics = await getMetrics();
    //Get the new uptime Checks and if there has been any updates

    if (newMetrics) {
      const [newUptimeCheck, changedUptimes] = await compareNewMetrics(
        newMetrics
      );
      //If it is true
      if (changedUptimes) {
        //We Update the uptimeChecks
        currentUptimeChecks = newUptimeCheck;
        socketServer.emit("currentUptimeChecks", currentUptimeChecks);
      }
    }
  }, 60000);
})();

socketServer.on("connection", async (socket) => {
  //We emit the current Uptime Checks
  const currentUptimeChecks = await getCurrentUptimeChecks();
  socket.emit("currentUptimeChecks", currentUptimeChecks);
  //We call all the events handlers
  createUptimeCheck(socket);
  getAllUptimeChecks(socket);

  //We disconnect the client
  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

module.exports = socketServer;
