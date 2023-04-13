# Title

## Summary

This project walks you through the process of setting up the Bakersville CookieFactory Digital Twin Monitoring Application powered by AWS IoT TwinMaker. 

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
2. Setup application AWS resources (e.g. AWS IoT TwinMaker, Sample Lambdas, Sample Data, etc.)
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
3. Setup Web Application
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
