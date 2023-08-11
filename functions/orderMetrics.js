/**
 * We are gonna get an array like this: 
 * [{
    checkerLocation: "us-central1",
    checker_id: "talal-portfolio-rX4C6-sH954",
    uptimeCheck: true,
    },
    {
    checkerLocation: "usa-iowa",
    checker_id: "test-to-fail-knkwM8kHn6c",
    uptimeCheck: false,
   }]

   In order metrics function we are gonna make an object that will have as key the checker_Id of every monitored page.
   This object is gonna store two things: 
   1 - Either the location was already stored or not (for not repeating the same location multiple time)
   2 - It stores in an array either the check passed or not in this format [checker Location, check passed (bool)]
 */

const orderMetrics = (metrics) => {
  const allChecks = {};
  //This varibale is for being able to iterate through the object further
  const allChecksId = [];
  for (checks of metrics) {
    //From where the check was made (brasil sao-paulo for example)
    const { checkerLocation } = checks;
    const { checker_id } = checks;
    //It say if the check passed or not
    const { uptimeCheck } = checks;

    //If there is not a object of the checker id we create one
    if (!allChecks[checker_id]) {
      //we create the new object
      allChecks[checker_id] = {};
      allChecksId.push(checker_id);
      // Store the two instances that appears above
      allChecks[checker_id][checkerLocation] = true;
      allChecks[checker_id]["check"] = [[checkerLocation, uptimeCheck]];
    } else if (!allChecks[checker_id][checkerLocation]) {
      // Store the two instances that appears above
      allChecks[checker_id]["check"].push([checkerLocation, uptimeCheck]);
      allChecks[checker_id][checkerLocation] = true;
    }
  }

  return defineMetrics(allChecks, allChecksId);
};

/**
   * The all check object will look something like this: {
    'talal-portfolio-rX4C6-sH954': { 'us-central1': true, check: [ ['us-central1', true] ] },
    'test-to-fail-knkwM8kHn6c': {
      'us-central1': true,
      check: [ [ 'us-central1', false ]  ],
    }
    But with more locations and checks
    Check Logic : From here we are gonna need to count all the passed checks, if all of them pass we return a 1, if more than the 
    half pass we return a 0 and if less of the half pass we return a -1
   */

const defineMetrics = (allChecks, allChecksId) => {
  const finalStatus = [];
  //We loop through all of the checks that we previously stored
  for (checksId of allChecksId) {
    const checks = allChecks[checksId].check;
    let passedChecks = 0;
    //we pick the array of the checks and loop through them
    for (checkStatus of checks) {
      if (checkStatus[1] === true) {
        passedChecks++;
      } else passedChecks--;
    }
    //We impliment the Check Logic
    if (passedChecks === checks.length) {
      finalStatus.push([checksId, 1]);
    } else if (passedChecks >= checks.length / 2) {
      finalStatus.push([checksId, 0]);
    } else finalStatus.push([checksId, -1]);
  }
  return finalStatus;
};

module.exports = orderMetrics;
