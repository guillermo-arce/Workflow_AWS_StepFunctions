'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.PARKING_TABLE_NAME;

module.exports.addCar = car => {
    const params = {
      TableName: TABLE_NAME,
      Item: car  
    };

    return dynamodb.put(params).promise().then(()=> {
        return car.carId;
    });
}

module.exports.getCar = carId => {
    const params = {
      Key:{
        carId: carId
      },
      TableName: TABLE_NAME
    };

    return dynamodb.get(params).promise().then(result => {
        return result.Item;
    });
}

module.exports.removeCar = carId => {
    const params = {
      TableName: TABLE_NAME,
      Key:{
        carId: carId
      }
    };

    return dynamodb.delete(params).promise();
}

