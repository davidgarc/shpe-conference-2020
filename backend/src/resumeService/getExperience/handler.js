const httpStatusCode = require('http-status-codes');
const dynamodb = require('aws-sdk/clients/dynamodb');
const documentClient = new dynamodb.DocumentClient();
const ErrorMessage = 'Could not find an order with the specified id.';

exports.lambdaHandler = async (event, context) => {
    const id = event.pathParameters.orderId;
    const order = await getOrderFromDynamo(id);

    if (!order) {
        return {
            statusCode: httpStatusCode.NOT_FOUND,
            body: { message: ErrorMessage }
        };
    }
    else {
        order.id = order.PK;
        delete order.PK;

        return order;
    }
};

async function getOrderFromDynamo(id) {
    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                PK: id
            }
        };

        const result = await documentClient.get(params).promise();

        return result.Item;
    } catch (err) {
        console.log('An error occurred getting order from Dynamo');
        console.log(err);
    }
}
