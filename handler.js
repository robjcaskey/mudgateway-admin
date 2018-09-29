'use strict';

module.exports.telnetTest = async (event, context) => {
  function telnetConnection(host, port) {
    return new Promise((resolve, reject) => {
      var output = "";
      var client = new net.Socket();
      client.connect(port, host, ()=> {
      })
      client.on('data', data => {
        console.log(data.toString())
        output += data.toString();
      });
      setTimeout(()=> {
        client.destroy();
        resolve(output);
      },300);
    });
  }
  var net = require('net');
  return telnetConnection('aardmud.org', 23)
  .then(output => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: output,
        input: event,
      }),
    };
  });

};

module.exports.hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
