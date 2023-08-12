const { UptimeCheck } = require("../models/uptimeCheck");

/**
 * Function that compares the new metrics with the ones that are stored in the DB
 */

module.exports = async (newMetrics) => {
  let checksUpdated = false;
  let currentUptimeChecks;

  for (metric of newMetrics) {
    //We find its metric instance by the metric id
    try {
      const currentMetricStatus = await UptimeCheck.find({
        checkedId: metric[0],
      });
      //if there is an instance
      if (currentMetricStatus[0]) {
        const newMetricStatus = metric[1];
        //if the checkedStatus are not the same
        if (currentMetricStatus[0].checkedStatus !== newMetricStatus) {
          //We update the DB instance
          await UptimeCheck.findOneAndUpdate(
            { checkedId: metric[0] },
            { checkedStatus: newMetricStatus },
            { new: true }
          );
          checksUpdated = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  //If we updated the DB we return the new uptimeChecks
  if (checksUpdated === true) {
    currentUptimeChecks = await UptimeCheck.find();
    return [currentUptimeChecks, checksUpdated];
  }
  //else We return null and false
  return [null, false];
};
