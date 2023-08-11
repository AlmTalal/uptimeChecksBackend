// Imports the Google Cloud client library
const monitoring = require("@google-cloud/monitoring");
// Create the projects authenitcation
const { GoogleAuth } = require("google-auth-library");
const auth = new GoogleAuth({
  keyFile: "./GCPKey.json",
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

// Create a client and give him authentication for the project
const client = new monitoring.MetricServiceClient({ auth: auth });

async function readTimeSeriesData() {
  const projectId = await client.getProjectId();

  /**
   * You can search for the metric Type In google CLoud console => monitoring =>
   * metrics explorer
   * => hover over the metric that you want and it's gonna appear a box with name, description and metric.
   * The metric is what we are gonna put on metric.type value
   */
  const filter =
    'metric.type="monitoring.googleapis.com/uptime_check/check_passed"';

  const request = {
    name: client.projectPath(projectId),
    filter: filter,
    interval: {
      startTime: {
        // Limit results of the metric to the last 10 minute
        seconds: Date.now() / 1000 - 60 * 10,
      },
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
  };

  // Gets time series data
  const [monitoredMetrics] = await client.listTimeSeries(request);
  const data = [];
  monitoredMetrics.forEach((monitoredMetric) => {
    //Choose the data that we want
    data.push({
      checkerLocation: monitoredMetric.metric.labels.checker_location,
      checker_id: monitoredMetric.metric.labels.check_id,
      uptimeCheck: monitoredMetric.points[0].value.boolValue,
    });
  });
  return data;
}

module.exports = readTimeSeriesData;
