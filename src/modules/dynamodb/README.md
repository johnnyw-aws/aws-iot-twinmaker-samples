### Setup

Set / confirm environment variables

```
# env vars - workspace expected to already exist from CookieFactory Base Content - can rename DDB table if needed
export DYNAMODB_TELEMETRY_STACK_NAME=DynamoDBTelemetry
export DYNAMODB_TABLE_NAME=TwinMakerTable
echo $WORKSPACE_ID
```

Deploy CDK stack containing AWS IoT TwinMaker connectors for DynamoDB

```
cd cdk
```

```
# install
npm install
cdk deploy --context twinmakerWorkspaceId=$WORKSPACE_ID --context dynamodbTableName=$DYNAMODB_TABLE_NAME --require-approval never
```

Import CSV data into DynamoDB 

```
STACK_OUTPUTS=$(aws cloudformation describe-stacks --stack-name $DYNAMODB_TELEMETRY_STACK_NAME | jq '.Stacks[0].Outputs')
DATA_KEY=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="DDBDataCsvS3Key").OutputValue')
DATA_BUCKET=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="DDBDataCsvS3Bucket").OutputValue')

IMPORT_ARN=$(aws dynamodb import-table --cli-input-json '{"S3BucketSource": {"S3Bucket": "'$DATA_BUCKET'","S3KeyPrefix": "'$DATA_KEY'"},"InputFormat": "CSV","TableCreationParameters": {"TableName": "'$DYNAMODB_TABLE_NAME'","AttributeDefinitions": [{"AttributeName": "thingName","AttributeType": "S"},{"AttributeName": "timestamp","AttributeType": "N"}],"KeySchema": [{"AttributeName": "thingName","KeyType": "HASH"},{"AttributeName": "timestamp","KeyType": "RANGE"}],"BillingMode": "PAY_PER_REQUEST"}}' --region us-east-1 | jq -r .ImportTableDescription.ImportArn) && echo $IMPORT_ARN 

    # use to verify import completion
    aws dynamodb describe-import --import-arn $IMPORT_ARN | jq .ImportTableDescription.ImportStatus

    # can take ~3 minutes
    while true; do 
      aws dynamodb describe-import --import-arn $IMPORT_ARN | jq .ImportTableDescription.ImportStatus
      sleep 10
    done
```

Create TwinMaker entity linked to DynamoDB

```
aws iottwinmaker create-entity --cli-input-json '{"workspaceId": "'$WORKSPACE_ID'","entityId": "airTwin", "entityName": "airTwin","components": {"dynamoAirComponent": {"componentTypeId": "com.dynamodb.airQuality"}}}'

    # use to verify entity status is ACTIVE
    aws iottwinmaker get-entity --entity-id airTwin --workspace-id $WORKSPACE_ID | jq .status.state
```

Read entity data from DynamoDB through Unified Data Query. You should see the airTwin data we stored previously

```
aws iottwinmaker get-property-value-history \
   --region us-east-1 \
   --cli-input-json '{"componentName": "dynamoAirComponent","endDateTime": "2022-11-01T00:00:00","entityId": "airTwin","orderByTime": "ASCENDING","selectedProperties": ["co2", "humidity", "temperature"],"startDateTime": "2021-11-01T00:00:00","workspaceId": "'$WORKSPACE_ID'"}'
```

### Teardown

```
# delete entity
aws iottwinmaker delete-entity --entity-id airTwin --workspace-id $WORKSPACE_ID

# delete table
aws dynamodb delete-table --table-name $DYNAMODB_TABLE_NAME

# delete CloudFormation stack (can also do via console or CLI)
cdk destroy --context twinmakerWorkspaceId=$WORKSPACE_ID --context dynamodbTableName=$DYNAMODB_TABLE_NAME
```

```
rm -rf node_modules && rm -rf cdk.out
```

---

TODOs:

* consider replacing ddb-import since much slower than direct PutItem given the size (import csv approach may be more useful as an example though?)
* generalize schema initializer + data reader for DDB?
  * should the primary key be entityId (simpler example)? or should it be an externalId (may be more realistic for customers with existing data)? 
* modify the dataset to better match CookieFactory?
* simplify README into a script instead?
* investigate why the Lambda output is appearing using "timestamp" instead of "time" field
* clean-up pass to align with rest of sample modules
* update main samples README to point to this as add-on content