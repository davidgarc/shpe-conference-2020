const httpStatusCode = require('http-status-codes');
const dynamodb = require('aws-sdk/clients/dynamodb');
const documentClient = new dynamodb.DocumentClient();
const ErrorMessage = 'Could not find an order with the specified id.';

exports.lambdaHandler = async (event, context) => {
    console.log(event);
    let experience;

    if (event.pathParameters && event.pathParameters.experienceId) {
      experience = await getExperienceFromDynamo(event.pathParameters.experienceId);
    } else if (event.pathParameters && event.pathParameters.educationId) {
      experience = await getExperienceFromDynamo(event.pathParameters.educationId);
    } else if (event.requestContext.http.path.includes('experiences')) {
      return await getExperiencesFromDynamo('experience');
    } else if (event.requestContext.http.path.includes('educations')) {
      return await getExperiencesFromDynamo('education');
    } else if (event.requestContext.http.path.includes('endorsements')) {
      return await getExperiencesFromDynamo('endorsement');
    }
    
    if (!experience) {
      return {
          statusCode: httpStatusCode.NOT_FOUND,
          body: { message: ErrorMessage }
      };
    } else {
      return experience;
    }
};

async function getExperienceFromDynamo(id) {
  try {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: id
        }
    };

    const result = await documentClient.get(params).promise();

    return result.Item;
} catch (err) {
    console.log('An error occurred getting experience from Dynamo');
    console.log(err);
}
}

async function getExperiencesFromDynamo(type) {
    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            ScanIndexForward: false,
            IndexName: "type_startDate",
            KeyConditionExpression: "#type = :type",
            ExpressionAttributeValues: {
              ":type": type
            },
            ExpressionAttributeNames: {
              "#type": "type"
            }
        };

        const result = await documentClient.query(params).promise();

        return result.Items;
    } catch (err) {
        console.log('An error occurred getting experiences from Dynamo');
        console.log(err);
    }
}
