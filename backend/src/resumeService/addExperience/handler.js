const short = require('short-uuid');
const httpStatusCode = require('http-status-codes');
const ErrorMessage = 'An error occurred saving the Experience.';
const BadRequest = 'Missing a required field. Check API Documentation.';
const dynamodb = require('aws-sdk/clients/dynamodb');
const documentClient = new dynamodb.DocumentClient();

exports.lambdaHandler = async (event, context) => {
    console.log(event);
    const experience = JSON.parse(event.body);

    if (!experience.name || !experience.startDate) {
        return {
            statusCode: httpStatusCode.BAD_REQUEST,
            body: { message: BadRequest }
        };
    }

    let id;
    if (event.requestContext.http.path.includes('experiences')) {
      id = await saveToDynamo(experience, 'experience');
    } else if (event.requestContext.http.path.includes('educations')) {
      id = await saveToDynamo(experience, 'education');
    }

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

async function saveToDynamo(experience, type) {
    try {
        experience.id = short.generate();
        experience.type = type;
        const params = {
            TableName: process.env.TABLE_NAME,
            Item: experience
        };

        await documentClient.put(params).promise();
        return experience.id;
    } catch (err) {
        console.log('An error occurred adding item to Dynamo');
        console.log(err);
    }
}
