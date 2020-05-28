'use strict';

const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();
const databaseManager = require('./databaseManager');

//Lambda Function -> Init Step Function
module.exports.executeStepFunction = (event, context, callback) => {

  var operationType = event.queryStringParameters.operationType;
  var clientName = event.queryStringParameters.clientName;
  var carModel = event.queryStringParameters.carModel;
  var carId = event.queryStringParameters.carId;


  callStepFunction(operationType,clientName,carModel,carId).then(result => {
    let message = 'Step function is executing';
    if (!result) {
      message = 'Step function is not executing';
    }

    const response = {
      statusCode: 200,
      headers: {

        'Access-Control-Allow-Origin': '*',
  
        'Access-Control-Allow-Credentials': true,
  
      },
      body: JSON.stringify({ message })
    };

    callback(null, response);
  });
};

//Lambda Function -> InputValidation
module.exports.inputValidation = (event, context, callback) => {
  console.log('inputValidation was called');

  var operationType = event.operationType;
  var clientName = event.clientName;
  var carModel = event.carModel;
  var carId = event.carId;

  var validOp = false;
  var validClName = false;
  var validCMod = false;
  var validCPla = false;

  if (operationType === "ADD" || operationType === "REMOVE")
    validOp = true;
  if (operationType === "ADD") {
    if (/^([\w\s]{3,40})$/.test(clientName))
      validClName = true;
    if (/^([\w\s]{3,40})$/.test(carModel))
      validCMod = true;
    if (/[a-zA-Z]{2}[0-9]{3}[a-zA-Z]{2}$/.test(carId))
      validCPla = true;
  }
  if (operationType === "REMOVE") {
    if (/[a-zA-Z]{2}[0-9]{3}[a-zA-Z]{2}$/.test(carId))
      validCPla = true;
    validCMod = true;
    validClName = true;
  }


  if (!validOp || !validClName || !validCMod || !validCPla)
    operationType = "INVALID";

  callback(null, { operationType, clientName, carModel, carId });
};

//Lambda Function -> Get Car
module.exports.getCar = (event, context, callback) => {
  console.log('getCar was called');

  databaseManager.getCar(event.carId).then(response => {
    console.log(response);
    if (response == null) {
      event.exists = "FALSE";
      callback(null, event);
    }
    else {
      event.exists = "TRUE";
      callback(null, event);
    }

  });
};

//Lambda Function -> Process Remove of Car 
module.exports.removeCar = (event, context, callback) => {
  console.log('removeCar was called');

  if (event.exists === "TRUE") {
    databaseManager.removeCar(event.carId).then(response => {
      console.log(response);
      callback(null, response)
    });
    callback(null, event);
  }
}

//Lambda Function -> Process Addition of Car 
module.exports.addCar = (event, context, callback) => {
  console.log('addCar was called');

  var clientName = event.clientName;
  var carModel = event.carModel;
  var carId = event.carId;
  
  var car = { carId, carModel, clientName };
  if (event.exists === "FALSE") {
    databaseManager.addCar(car).then(response => {
      console.log(response);
      callback(null, response)
    });
  }
};

function callStepFunction(operationType, clientName, carModel, carId) {
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
            input: JSON.stringify({ operationType:operationType,clientName: clientName, carModel: carModel, carId: carId })
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
};