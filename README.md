# SHPE 2020 National Conference Tech Talk

[Link to Tech Talk](https://shpe2020.mapyourshow.com/8_0/sessions/session-details.cfm?scheduleid=119)

# Serverless REST API on AWS

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* AWS CLI - [Install the AWS CLI](https://aws.amazon.com/cli/)
* Node.js - [Install Node.js 12](https://nodejs.org/en/)

Once you have installed the requirements above, navigate to the shared layer path `backend/src/sharedLayers/libs/awsLayer/nodejs` and run the command below:
```bash
npm install
```

Now we are ready to deploy our application. To deploy your application run the following in your shell:
Valid environments are dev, test, prod. Bucket names, if new needs to be unique across AWS regions.
```bash
node deploy.js <environment> <configs-bucket-name> <website-bucket-name>
```

You can find your API Gateway Endpoint URL and Website URL in the output values displayed after deployment.

Sample Output:
```bash
CloudFormation outputs from deployed stack
-------------------------------------------------------------------------------------------------
Outputs
-------------------------------------------------------------------------------------------------
Key                 WebsiteULR
Description         Resume Website URL
Value               http://shpe-resume-david.s3-website-us-east-1.amazonaws.com

Key                 ApiUri
Description         API Gateway endpoint URI
Value               https://2e4t1u3tfl.execute-api.us-east-1.amazonaws.com/dev
-------------------------------------------------------------------------------------------------
```

Now you need to update the variable *API_ENDPOINT* in the file `public/scripts.js` with the value from your ApiUri

Deploy your website files with the following command:
```bash
aws s3 cp --recursive public "s3://<website-bucket-name>/"
```
Note: The website bucket name should be the one that you provided in the deploy script.