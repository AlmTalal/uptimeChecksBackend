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

//UptimeCheck events
const createUptimeCheck = require("./socketEvents/uptimeChecks/createUptimeCheck");
const getAllUptimeChecks = require("./socketEvents/uptimeChecks/getUptimeChecks");
//User Events
const auth = require("./socketEvents/users/login");
const hasAuthorization = require("./socketEvents/users/authorization");
//Connecting to mongoose
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
  } catch (error) {
    console.log(error);
  }
})();

let currentUptimeChecks;

(async () => {
  //every 60 seconds
  setInterval(async () => {
    currentUptimeChecks = await getCurrentUptimeChecks();
    const newMetrics = await getMetrics();
    //Get the new uptime Checks and if there has been any updates

    if (newMetrics) {
      const [newUptimeCheck, changedUptimes] = await compareNewMetrics(
        newMetrics,
        currentUptimeChecks
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
  //If the server was down and a new user connects
  if (currentUptimeChecks == undefined) {
    currentUptimeChecks = await getCurrentUptimeChecks();
  }

  //We give the current Uptime Checks
  socket.on("giveUptimeChecks", (callback) => {
    callback(currentUptimeChecks);
  });

  //Uptime check events
  createUptimeCheck(socket);
  getAllUptimeChecks(socket);
  //User Events
  auth(socket);
  hasAuthorization(socket);

  //We disconnect the client when he closes the page
  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

module.exports = socketServer;
