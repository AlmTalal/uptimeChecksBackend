const { UptimeCheck } = require("../models/uptimeCheck");

/**
 * Function that compares the new metrics with the ones that are stored in the DB
 * The Algorithm is O(n*m) beacuase we have to search the newMetric Id inside the currenMetrics array so
 * O(newMetrics * currentMetrics)
 */

module.exports = async (newMetrics, currentMetrics) => {
  let checksUpdated = false;

  for (metric of newMetrics) {
    const newMetricId = metric[0];
    for (currentMetric of currentMetrics) {
      if (currentMetric.checkedId == newMetricId) {
        const newMetricStatus = metric[1];
        //if the checkedStatus are not the same
        if (currentMetric.checkedStatus != newMetricStatus) {
          //We update the DB instance
          try {
            await UptimeCheck.findOneAndUpdate(
              { checkedId: metric[0] },
              { checkedStatus: newMetricStatus },
              { new: true }
            );
            checksUpdated = true;
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }
  //If we updated the DB we return the new uptimeChecks
  if (checksUpdated === true) {
    try {
      const currentUptimeChecks = await UptimeCheck.find();
      return [currentUptimeChecks, checksUpdated];
    } catch (error) {
      console.log(error);
    }
  }
  //else We return null and false
  return [null, false];
};
