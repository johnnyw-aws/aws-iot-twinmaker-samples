# AWS IoT TwinMaker Getting Started - Bakersville Cookie Factory Digital Twin Monitoring Application

## Summary

This project walks you through the process of setting up the Bakersville Cookie Factory Digital Twin Monitoring Application powered by AWS IoT TwinMaker. 

![WebAppDashboard](docs/MonitoringApplication.png)

## Prerequisites

* node + npm
* CDK + AWS account that has been bootstrapped for CDK
* awscli
* docker

TODO indicate specific versions for above, validate in Cloud9 environment

---

## Setup / Test

1. Create a TwinMaker workspace
1. Setup application AWS resources (e.g. AWS IoT TwinMaker, Sample Lambdas, Sample Data, etc.)
    - Prepare environment (run from the same directory as this README)
      ```
      cd cdk
      
      npm install
      
      aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
      ```
    - Deploy CDK stack containing application resources. Fill-in parameters based on your AWS IoT TwinMaker workspace.
      ```
      cdk deploy \
        --context stackName="__FILL_IN__" \
        --context iottwinmakerWorkspaceId="__FILL_IN__" \
        --context iottwinmakerWorkspaceBucket="__FILL_IN__"
      ```
1. (optional) Sample calls to validate resources created
    - UDQ
      ```
      aws iottwinmaker get-property-value-history \
          --region us-east-1 \
          --cli-input-json '{"componentName": "CookieLineComponent","endTime": "2023-06-01T00:00:00Z","entityId": "PLASTIC_LINER_a77e76bc-53f3-420d-8b2f-76103c810fac","orderByTime": "ASCENDING","selectedProperties": ["alarm_status", "AlarmMessage", "Speed", "Resources"],"startTime": "2022-06-01T00:00:00Z","workspaceId": "__FILL_IN__", "maxResults": 10}'
      ```
    - Knowledge Graph
      ```
      aws iottwinmaker execute-query --cli-input-json '{"workspaceId": "__FILL_IN__","queryStatement": "SELECT processStep, r1, e, r2, equipment     FROM EntityGraph     MATCH (cookieLine)<-[:isChildOf]-(processStepParent)<-[:isChildOf]-(processStep)-[r1]-(e)-[r2]-(equipment), equipment.components AS c     WHERE cookieLine.entityName = '"'"'COOKIE_LINE'"'"'     AND processStepParent.entityName = '"'"'PROCESS_STEP'"'"'     AND c.componentTypeId = '"'"'com.example.cookiefactory.equipment'"'"'"}'
      ```
    - Open scene in console: `https://us-east-1.console.aws.amazon.com/iottwinmaker/home?region=us-east-1#/workspaces/__FILL_IN__/scenes/CookieFactory`

1. Setup Web Application
   - Follow instructions in [CookieFactoryDemo](./CookieFactoryDemo/README.md)

TODO update instructions to be new-to-AWS-friendly
TODO consolidate instructions from CookieFactoryDemo README

## Cleanup

1. Delete resources using CDK (note: can also be done in AWS Console / CLI against the CloudFormation stack)
    - cdk destroy
        ```
        cdk destroy \
          --context stackName="__FILL_IN__" \
          --context iottwinmakerWorkspaceId="__FILL_IN__" \
          --context iottwinmakerWorkspaceBucket="__FILL_IN__"
        ```
2. TODO: cleanup instructions for resources created as part of CookieFactoryDemo (e.g. User pools etc.)

---

## License

This project is licensed under the Apache-2.0 License.
