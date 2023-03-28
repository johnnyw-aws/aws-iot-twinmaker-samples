# Title

## Summary

TODO: {what this content is, what capabilities does it provide}

Note: If you encounter any issues, try checking the Troubleshooting section at the end of this page

## Prerequisites

TODO: {requirements for running this}

---

## Setup / Test

TODO fill-in

1. {setup + testing steps that showcase functionality}
    - sub instruction
      ```
      aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
      
      cdk deploy \
        --context stackName="__FILL_IN__" \
        --context iottwinmakerWorkspaceId="__FILL_IN__" \
        --context iottwinmakerWorkspaceBucket="__FILL_IN__"
      ```
2. ...

## Cleanup

TODO fill-in

1. {steps to cleanup everything}
    - sub instruction
        ```
        commands to run...
        ```
2. ...

---

## Troubleshooting

For any issue not addressed here, please open an issue or contact AWS Support.

### {searchable error string}

Details on possible causes...

1. Steps to mitigate

---

## License

This project is licensed under the Apache-2.0 License.