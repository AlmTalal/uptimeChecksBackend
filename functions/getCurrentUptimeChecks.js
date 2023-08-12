const { UptimeCheck } = require("../models/uptimeCheck");

module.exports = async () => {
  try {
    return await UptimeCheck.find();
  } catch (error) {
    return false;
  }
};
