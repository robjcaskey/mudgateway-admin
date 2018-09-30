'use strict';

var AWS = require('aws-sdk');
var ec2 = new AWS.EC2();
var fs = require('fs');

// regrettably not handled by serverless yet
var SECURITY_GROUP_NAME="mudconnect-proxy";
var encoded_init_script = fs.readFileSync("init_script.sh").toString('base64');


module.exports.spawn = async (event, context) => {
  // Amazon Linux 2 AMI (HVM), SSD Volume Type
  //var AMI =  "ami-04681a1dbd79675a5"
  // Ubuntu 18.04 LTS
  var AMI = "ami-0ac019f4fcb7cb7e6";
  var INSTANCE_TYPE = "t2.nano";
  
  function runInstance(params) {
    return new Promise((resolve, reject) => {
      ec2.runInstances(params, (err, result) => {
        if(err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      });
    });
  }

  return runInstance({
    ImageId:AMI,
    InstanceType:INSTANCE_TYPE,
    SecurityGroups: [SECURITY_GROUP_NAME],
    MinCount:1,
    MaxCount:1,
    InstanceInitiatedShutdownBehavior:'terminate',
    UserData:encoded_init_script
  })
  .then((result)=> {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Go Serverless v1.0! Your function executed successfully!',
        result:result,
        input: event,
      }),
    };
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
