// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2021
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';
import { aws_logs as logs } from 'aws-cdk-lib';
import { aws_lambda_nodejs as nodejs_lambda } from "aws-cdk-lib";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {aws_s3_assets as assets} from "aws-cdk-lib";
import { aws_iottwinmaker as tm } from "aws-cdk-lib";

export class DynamoDBTelemetryStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // IAM role with DDB access for Lambda execution
    const ddbConnectorIamRole = new iam.Role(this, 'ddbConnectorIamRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    ddbConnectorIamRole.addManagedPolicy(iam.ManagedPolicy.fromManagedPolicyArn(this, "lambdaExecRole","arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"))
    ddbConnectorIamRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBReadOnlyAccess"))

    // provide the DDB table name as a Lambda environment variable
    const dynamodbTableName : string = this.node.tryGetContext("dynamodbTableName");
    console.log(`Configuring Lambdas to use following DynamoDB table: ${dynamodbTableName}`);

    // Lambda implementation for AWS IoT TwinMaker SchemaInitializer
    const schemaInitConnector = new nodejs_lambda.NodejsFunction(this, 'lambda-ddb-schemaInitializer', {
      entry: (path.join(__dirname, '..', '..', 'lambda-ddb-schemaInitializer', 'index.js')),
      handler: 'handler',
      memorySize: 256,
      role: ddbConnectorIamRole,
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.minutes(1),
      logRetention: logs.RetentionDays.ONE_DAY,
      environment: {
        "DYNAMODB_TABLE_NAME": dynamodbTableName,
      }
    });

    // Lambda implementation for AWS IoT TwinMaker DataReader
    const ddbDataReaderConnector = new nodejs_lambda.NodejsFunction(this, 'lambda-ddb-reader', {
      entry: (path.join(__dirname, '..', '..', 'lambda-ddb-reader', 'index.js')),
      handler: 'handler',
      memorySize: 256,
      role: ddbConnectorIamRole,
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.minutes(1),
      logRetention: logs.RetentionDays.ONE_DAY,
      environment: {
        "DYNAMODB_TABLE_NAME": dynamodbTableName,
      }
    });

    // Upload sample telemetry data into S3, will be imported into DynamoDB so output the S3 location
    const asset = new assets.Asset(this, 'SampleAsset', {
      path: path.join(__dirname, '..', '..', 'data.csv'),
    });
    new CfnOutput(this, "DDBDataCsvS3Bucket", { value: asset.s3BucketName });
    new CfnOutput(this, "DDBDataCsvS3Key", { value: asset.s3ObjectKey });

    // Create component type associated with DynamoDB connectors
    const twinmakerWorkspace : string = this.node.tryGetContext("twinmakerWorkspaceId");
    console.log(`Creating component type in TwinMaker workspace: ${twinmakerWorkspace}`);

    new tm.CfnComponentType(this, "ddb-component-type", {
      componentTypeId: "com.dynamodb.airQuality",
      workspaceId: twinmakerWorkspace,
      description: "Connector for DynamoDB – Use case Air Quality",
      functions: {
        schemaInitializer: {
          implementedBy: {
            lambda: {
              arn: schemaInitConnector.functionArn,
            }
          }
        },
        dataReader: {
          implementedBy: {
            lambda: {
              arn: ddbDataReaderConnector.functionArn,
            }
          }
        },
      }
    });
  }
}
