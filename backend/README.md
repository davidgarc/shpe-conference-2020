# Serverless REST API on AWS

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* AWS CLI - [Install the AWS CLI](https://aws.amazon.com/cli/)
* Node.js - [Install Node.js 10](https://nodejs.org/en/), including the NPM package management tool.

To build and deploy your application for the first time, run the following in your shell:
Valid environments are dev, test, prod.
```bash
./deploy.sh <environment>
```

The first command will build the source of your application and will package and deploy your application to AWS

Make sure you have created the bucket name were the packaged templates will be copies. Default ones are:
```
orders-demo-configs-<environment>
```

You can find your API Gateway Endpoint URL in the output values displayed after deployment.
