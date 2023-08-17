const { UptimeCheck } = require("../models/uptimeCheck");

/**
 * Function that compares the new metrics with the ones that are stored in the DB
 * The Algorithm is O(n+m) beacuase we have to loop through newMetrics to put them in an object with the id
 * as key and the status as result
 * And then loop through current metrics for compairing the metrics
 */

module.exports = async (newMetrics, currentMetrics) => {
  let checksUpdated = false;
  const metrics = refactorMetrics(newMetrics);

  for (const currentMetric of currentMetrics) {
    const newMetricStatus = metrics[currentMetric.checkedId];
    //if the checkedStatus are not the same
    if (currentMetric.checkedStatus != newMetricStatus) {
      //We update the DB instance
      try {
        await UptimeCheck.findOneAndUpdate(
          { checkedId: currentMetric.checkedId },
          { checkedStatus: newMetricStatus },
          { new: true }
        );
        checksUpdated = true;
      } catch (error) {
        console.log(error);
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

// Takes the metrics and refactor them to an object with the id as key and the status as result
function refactorMetrics(metrics) {
  const newMetrics = {};
  for (const metric of metrics) {
    const metricId = metric[0];
    const metricStatus = metric[1];
    newMetrics[metricId] = metricStatus;
  }
  return newMetrics;
}
