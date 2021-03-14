const AWS = require("aws-sdk");

/**
 * Reboot EC2 instances
 *
 * @param {String} event.body.accessKeyId
 * @param {String} event.body.secretAccessKey
 * @param {String} event.body.region
 */
module.exports.EC2Reboot = async (event) => {
  const { accessKeyId, secretAccessKey, region } = JSON.parse(event.body);
  const { monitorFriendlyName } = event.queryStringParameters;
  const servers = {
    ServerJava: ["<ec2-instance-id>"],
    ServerRuby: ["<ec2-instance-id>"],
  };

  if (!Object.keys(servers).includes(monitorFriendlyName)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Invalid server" }),
    };
  }

  if (!accessKeyId || !secretAccessKey) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Invalid keys" }),
    };
  }

  AWS.config.update({
    credentials: { accessKeyId, secretAccessKey },
    region: region || "sa-east-1",
    maxRetries: 2,
    httpOptions: {
      timeout: 30000,
      connectTimeout: 5000,
    },
  });

  const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

  const params = {
    InstanceIds: servers[monitorFriendlyName],
    DryRun: false,
  };

  try {
    await ec2.rebootInstances(params).promise();
    return {
      statusCode: 200,
    };
  } catch (err) {
    return {
      statusCode: 503,
      message: JSON.stringify(err),
    };
  }
};
