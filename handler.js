'use strict';

const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();

//Lambda Function -> Init Step Function
module.exports.executeStepFunction = (event, context, callback) => {
  console.log('executeStepFunction');

  const number = event.queryStringParameters.number;
  console.log(number);

  callStepFunction(number).then(result => {
    let message = 'Step function is executing';
    if (!result) {
      message = 'Step function is not executing';
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message })
    };

    callback(null, response);
  });
};

//Lambda Function -> InputValidation
module.exports.inputValidation = (event, context, callback) => {
  console.log('inputValidation was called');

  let result = event.number;
  console.log(result);

  callback(null, { result });
};

//Lambda Function -> Get Car 
module.exports.getCar = (event, context, callback) => {
  console.log('getCar was called');
  console.log(event);

  callback(null, null);
};

//Lambda Function -> Process Remove of Car 
module.exports.removeCar = (event, context, callback) => {
  console.log('removeCar was called');
  console.log(event);

  callback(null, null);
};

//Lambda Function -> Process Addition of Car 
module.exports.addCar = (event, context, callback) => {
  console.log('addCar was called');
  console.log(event);

  callback(null, null);
};


//Lambda Function -> Get All Cars 
module.exports.getCars = (event, context, callback) => {
  console.log('getCars was called');
  console.log(event);

  callback(null, null);
};


function callStepFunction(number) {
  console.log('callStepFunction');

  const stateMachineName = 'TestingStateMachine'; // The name of the step function we defined in the serverless.yml
  console.log('Fetching the list of available workflows');

  return stepfunctions
    .listStateMachines({})
    .promise()
    .then(listStateMachines => {
      console.log('Searching for the step function', listStateMachines);

      for (var i = 0; i < listStateMachines.stateMachines.length; i++) {
        const item = listStateMachines.stateMachines[i];

        if (item.name.indexOf(stateMachineName) >= 0) {
          console.log('Found the step function', item);

          var params = {
            stateMachineArn: item.stateMachineArn,
            input: JSON.stringify({ number: number })
          };

          console.log('Start execution');
          return stepfunctions.startExecution(params).promise().then(() => {
            return true;
          });
        }
      }
    })
    .catch(error => {
      return false;
    });
}
