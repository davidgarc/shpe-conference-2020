# SHPE 2020 National Conference Tech Talk - Serverless Resume Web Application with a REST API backend on AWS

[Link to Tech Talk](https://shpe2020.mapyourshow.com/8_0/sessions/session-details.cfm?scheduleid=119)

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI.

The application uses several AWS resources, including Lambda functions, API Gateway, DynamoDb and Amazon S3. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Prerequisites

You will need an AWS account. If you don't have one you can create one for free [here](https://aws.amazon.com/free/free-tier/).

In order for us to deploy our application you need the following software installed on your computer:

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* AWS CLI - [Install the AWS CLI](https://aws.amazon.com/cli/)
* Node.js - [Install Node.js 12](https://nodejs.org/en/)

You need to create an Amazon S3 configuration bucket.

## Deploy your Resume Web Application

1. Navigate to the shared layer path `backend/src/sharedLayers/libs/awsLayer/nodejs` and run the command below:

```bash
npm install
```

2. Navigate back to the root of the project and run the command below to deploy your application.

```bash
node deploy.js <environment> <configs-bucket-name> <website-bucket-name>
```

**Note**: Valid environments are **dev**, **test**, **prod**. Bucket names needs to be unique across AWS regions, so make sure to pick an unique name for yours.

3. After the deployment completes. Write down your WebsiteURL and your APIUri. You can see a sample output below.

### Sample Output

```bash
CloudFormation outputs from deployed stack
-------------------------------------------------------------------------------------------------
Outputs
-------------------------------------------------------------------------------------------------
Key                 WebsiteURL
Description         Resume Website URL
Value               http://shpe-resume-david.s3-website-us-east-1.amazonaws.com

Key                 ApiUri
Description         API Gateway endpoint URI
Value               https://2e4t1u3tfl.execute-api.us-east-1.amazonaws.com/dev
-------------------------------------------------------------------------------------------------
```

4. Now you need to update the website files in the `public/` folder.
    1. Set the variable *API_ENDPOINT* in the file `public/scripts.js` with the value from your ApiUri.
    2. Customize the contents of the file `public/index.html` with your name, a description about yourself and your contact information.

5. Deploy your website files with the following command:

```bash
aws s3 cp --recursive public "s3://<website-bucket-name>/"
```

**Note**: The website bucket name should be the one that you provided in the deploy script.

6. Navigate to your new Resume Web Application.

7. You will notice that the details you added are there but we are missing the education, experience and endorsements details. We need to call our REST API so we can create this data. Customize the payload samples and request samples below to create your own entries.

## Sample Requests

**Note**: Remember to replace the APIUri with yours. You can omit the *endDate* field if you are still working on that experience or education.

### Create an endorsement entry (uri path: /endorsements)

```sh
curl --location --request POST 'https://vvmvzb0otg.execute-api.us-east-1.amazonaws.com/dev/endorsements' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Bill Gates",
    "description": "David is a great!!!",
    "startDate": "01/01/2020"
}'
```

### Create an experience entry (uri path: /experiences)

```sh
curl --location --request POST 'https://vvmvzb0otg.execute-api.us-east-1.amazonaws.com/dev/experiences' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "CADMART",
    "role": "Network Engineer",
    "description": "Network Engineer working on VoIP and SMB networks.",
    "startDate": "09/15/2011",
    "endDate": "09/15/2013"
}'
```

### Create an education entry (uri path: /educations)

```sh
curl --location --request POST 'https://vvmvzb0otg.execute-api.us-east-1.amazonaws.com/dev/educations' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Florida International (FIU)",
    "role": "Research Assistant",
    "description": "Develop driver for new Solid State Drive(SSD) architecture",
    "startDate": "06/01/2014",
    "endDate": "06/01/2014"
}'
```

## Sample Payloads

### Endorsement Payload

```json
{
    "name": "John Perez",
    "description": "David is a great!!!",
    "startDate": "01/01/2020"
}
```

### Education Payload

```json
{
    "name": "Florida International University (FIU)",
    "role": "Research Assistant",
    "description": "Develop driver for new Solid State Drive(SSD) architecture",
    "startDate": "06/01/2013",
    "endDate": "06/01/2014"
}
```

### Experience Payload

```json
{
    "name": "USAA",
    "role": "Senior Software Engineer",
    "description": "Software Engineer at the Member Data Services Team",
    "startDate": "09/15/2014"
}
```
