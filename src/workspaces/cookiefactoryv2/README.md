# AWS IoT TwinMaker Getting Started - Bakersville Cookie Factory Digital Twin Monitoring Application

## Summary

This project walks you through the process of setting up the Bakersville Cookie Factory Digital Twin Monitoring Application powered by AWS IoT TwinMaker. 

![WebAppDashboard](docs/MonitoringApplication.png)

## Prerequisites

Note: These instructions have primarily been tested for OSX/Linux/WSL environments. For a standardized development environment, consider using [AWS Cloud9](https://aws.amazon.com/cloud9).

1. This sample depends on AWS services that might not yet be available in all regions. Please run this sample in one of the following regions:
   - US East (N. Virginia) (us-east-1)
   - US West (Oregon) (us-west-2)
   - Europe (Ireland) (eu-west-1)
2. An AWS account for IoT TwinMaker + [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
   - We recommend that you [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) your default credentials to match the account in which you want to set up this getting started example. Use the following command to verify that you are using the correct account. (This should be pre-configured in Cloud9.)
     ```shell
     aws sts get-caller-identity
     ```
   - Ensure your AWS CLI version is at least 1.22.94. (or 2.5.5+ for AWS CLI v2)
     ```shell
     aws --version
     ```
   - When you are set up, test your access with the following command. (You should not receive errors.)
     ```
      aws iottwinmaker list-workspaces --region us-east-1
     ```
   - Note: your credentials should have permissions to AWS S3, AWS IoT TwinMaker, and AWS CloudFormation to deploy the content to your account.
4. [Node.js](https://nodejs.org/en/) & [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) with node v16.x+ and npm version 8.10.0+. (This should be pre-installed in Cloud9.) Use the following commands to verify.

   ```shell
   node --version
   ```

   ```shell
   npm --version
   ```

5. [AWS CDK toolkit](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install) with version at least `2.76.0`. (The CDK should be pre-installed in Cloud9, but you may need to bootstrap your account.) Use the following command to verify.

   ```shell
   cdk --version
   ```

   - You will also need to bootstrap your account for CDK so that custom assets, such as sample Lambda functions, can be easily deployed. Use the following command.

     ```shell
     cdk bootstrap aws://[your 12 digit AWS account id]/[region] --app ''

     # example
     # cdk bootstrap aws://123456789012/us-east-1 --app ''
     ```

6. [Docker](https://docs.docker.com/get-docker/) version 20+ installed and running. (This should be pre-installed in Cloud9.) Authenticate Docker for public ECR registries
   ```shell
   docker --version
   ```
   - Use the following command to build Lambda layers for CDK.
     ```shell
     aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
     ```

---

## Setup / Test

1. Create a TwinMaker workspace
   1. Console instructions
      1. Go to https://us-east-1.console.aws.amazon.com/iottwinmaker/home
      2. Click "Create Workspace"
      3. Enter a workspace name of your choice and note it down (will be supplied to later commands below)
      4. Under "S3 bucket", select "Create an S3 bucket"
      5. Under "Execution Role", select "Auto-generate a new role"
      6. Click "Skip to review and create"
      7. Click "Create workspace". Note the name of the created S3 bucket (will be supplied to later commands below)
2. Setup application AWS resources (e.g. AWS IoT TwinMaker, Sample Lambdas, Sample Data, etc.)
    - Prepare environment (run from the same directory as this README)
      ```
      cd cdk
      
      npm install
      
      aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
      ```
    - Deploy CDK stack containing application resources. Fill-in parameters based on your AWS IoT TwinMaker workspace and preferred stack name.
      ```
      cdk deploy \
        --context stackName="__FILL_IN__" \
        --context iottwinmakerWorkspaceId="__FILL_IN__" \
        --context iottwinmakerWorkspaceBucket="__FILL_IN__"
      ```
3. (optional) Sample calls to validate resources created
    - UDQ
      ```
      aws iottwinmaker get-property-value-history \
          --region us-east-1 \
          --cli-input-json '{"componentName": "CookieLineComponent","endTime": "2023-06-01T00:00:00Z","entityId": "PLASTIC_LINER_a77e76bc-53f3-420d-8b2f-76103c810fac","orderByTime": "ASCENDING","selectedProperties": ["alarm_status", "AlarmMessage", "Speed"],"startTime": "2022-06-01T00:00:00Z","workspaceId": "__FILL_IN__", "maxResults": 10}'
      ```
    - Knowledge Graph
      ```
      aws iottwinmaker execute-query --cli-input-json '{"workspaceId": "__FILL_IN__","queryStatement": "SELECT processStep, r1, e, r2, equipment     FROM EntityGraph     MATCH (cookieLine)<-[:isChildOf]-(processStepParent)<-[:isChildOf]-(processStep)-[r1]-(e)-[r2]-(equipment), equipment.components AS c     WHERE cookieLine.entityName = '"'"'COOKIE_LINE'"'"'     AND processStepParent.entityName = '"'"'PROCESS_STEP'"'"'     AND c.componentTypeId = '"'"'com.example.cookiefactory.equipment'"'"'"}'
      ```
    - Open scene in console: `https://us-east-1.console.aws.amazon.com/iottwinmaker/home?region=us-east-1#/workspaces/__FILL_IN__/scenes/CookieFactory`



## Configure Web Application

First change directory to CookieFactoryDemo
``` 
cd ../CookieFactoryDemo 
```

1. Change `WORKSPACE_ID` in `src/config/sites.ts` to your workspace ID.
2. Use the following CLI command to administratively set the password for your demo Cognito user, Fran. Your User_Pool_id can be found after your CDK deploy completed in the CloudFormationOutput (printed to console). The demo Username is "fran@cookiefactory". Be sure to create a password that meets the default Cognito password requirements (Lowercase letter, Uppercase letter, Number, Symbol, Length >= 8)
```
aws cognito-idp admin-set-user-password --user-pool-id "[YOUR_USER_POOL_ID]" --username "[USERNAME]" --password "[PASSWORD]" --permanent
```

3. Set your AWS and Cognito user credentials in: `src/config/cognito.template.ts` and `src/config/user.template.ts` and rename the files to `src/config/cognito.ts` and `src/config/users.ts`, respectively. You will need your newly created Cognito UserPoolId, IdentityPoolId, ClientId, Username and password for your user

OPTIONAL: view [Console instructions](./CookieFactoryDemo/COGNITO_SAMPLE_SETUP_CONSOLE.md) for sample Amazon Cognito configuration (already created through CDK). You may use Cognito to configure custom security settings for your User Pools.

### Install

```shell
npm install
```

### Development server

* Edit `webpack.dev.js` if needed to change the port for the application (default is port 5000)

```shell
npm run dev
```

* Navigate to the application at `localhost:5000` (default) - Note: it may take a minute to load the first time

### Build

```shell
npm run build
```
---

## Cleanup

1. Delete resources using CDK (note: can also be done in AWS Console / CLI against the CloudFormation stack)
    - cdk destroy
        ```
        cdk destroy \
          --context stackName="CookieFactoryDemo" \
          --context iottwinmakerWorkspaceId="$WORKSPACE_ID" \
          --context iottwinmakerWorkspaceBucket="$WORKSPACE_BUCKET_NAME"
        ```
2. Navigate to the AWS Cognito console and delete CookiefactoryUserPool in the "User pools" tab by selecting the name, clicking "delete", and confirming the name in the prompt.
---

## License

This project is licensed under the Apache-2.0 License.
