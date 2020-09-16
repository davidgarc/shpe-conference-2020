const short = require('short-uuid');
const httpStatusCode = require('http-status-codes');
const ErrorMessage = 'An error occurred saving the Order.';
const BadRequest = 'Name is a required field';
const dynamodb = require('aws-sdk/clients/dynamodb');
const documentClient = new dynamodb.DocumentClient();

exports.lambdaHandler = async (event, context) => {
    const order = JSON.parse(event.body);

    if (!order.name) {
        return {
            statusCode: httpStatusCode.BAD_REQUEST,
            body: { message: BadRequest }
        };
    }

    const id = await saveToDynamo(order);
    if (!id) {
        return {
            statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
            body: { message: ErrorMessage }
        };
    }
    else {
        return { id: id };
    }
};

async function saveToDynamo(order) {
    try {
        const id = short.generate();
        order.PK = id;
        const params = {
            TableName: process.env.TABLE_NAME,
            Item: order
        };

        await documentClient.put(params).promise();
        return id;
    } catch (err) {
        console.log('An error occurred adding item to Dynamo');
        console.log(err);
    }
}
