# AWS IoT TwinMaker Cookie Factory Demo: Setting up user authentication in Cognito

The web application requires specific Cognito profiles, corresponding to the two user types, to be set up in order to access the backend’s resources. Note that the following configuration is a sample demo setup, for production deployments please adjust settings as appropriate for your organization's security policy.

Setting up the user pool

In Cognito, select ‘Create user pool’

* In ‘Configure sign-in experience’, select ‘Email’ under ‘Cognito user pool sign-in options’, then hit ‘Next’.
* In ‘Configure security requirements’, under ‘Multi-factor authentication’, select ‘No MFA’, then hit ‘Next’.
* In ‘Configure sign-up experience’, under ‘Self-service sign-up’, deselect ‘Enable self-registration.’
* Under ‘Attribute verification and user account confirmation’, deselect ‘Allow Cognito to automatically send messages to verify and confirm - Recommended’. Then click ‘Next’.
* In ‘Configure message delivery’, select ‘Send email with Cognito’ and do not add a ‘REPLY-TO email address’. Then click ‘Next’.
* In ‘Integrate your app’, name your user pool whatever you’d like.
* Under ‘Initial app client’, select ‘Other’, and name your app whatever you’d like.
* Under ‘Advanced app client settings’, open the ‘Authentication flows’ dropdown and select ‘'ALLOW_USER_SRP_AUTH'. Then click ‘Next’.
* Finally, review your settings and click ‘Create’.

Adding Cognito users

* On your newly created user pool page, scroll down and under ‘Users’ click ‘Create user’.
* Under ‘User information’, enter the user’s email address and check ‘Mark email address as verified’. You can choose to set a password here or have one generated for you. Note that if you generate a password, you will have to update your credentials in the web app to match.
* On the left hand navigation bar, selected ‘Federate entities’ then ‘Create new identity pool’. Name your identity pool and select ‘Allow Basic (Classic) Flow’
* Open the ‘Authentication providers’ dropdown and enter the ‘User Pool ID’ and ‘App client id’ for the user pool you just created (App client id is found under ‘App integration’ and ‘App clients and analytics’ in the user pool dashboard). Then click ‘Create pool’.
* In the next step, since both users will be authorized, you can just change the IAM policy under the authorized role, though changing both won’t do any harm. Make sure to update the account id and workspace name fields in the role below before completing the process.
  * Be sure to replace the content for  `[ACCOUNT_ID]` and `[WORKSPACE_NAME]`

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iottwinmaker:GetPropertyValue",
                "iottwinmaker:ExecuteQuery",
                "iottwinmaker:ListEntities",
                "iottwinmaker:ListComponentTypes",
                "iottwinmaker:GetPropertyValueHistory",
                "iottwinmaker:GetScene",
                "iottwinmaker:ListScenes",
                "iottwinmaker:GetEntity",
                "iottwinmaker:GetWorkspace",
                "iottwinmaker:GetComponentType"
            ],
            "Resource": [
                "arn:aws:iottwinmaker:us-east-1:[ACCOUNT_ID]:workspace/[WORKSPACE_NAME]/*",
                "arn:aws:iottwinmaker:us-east-1:[ACCOUNT_ID]:workspace/[WORKSPACE_NAME]"
            ]
        },
        {
            "Effect": "Allow",
            "Action": "iottwinmaker:ListWorkspaces",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::[WORKSPACE_BUCKET]/*"
        }
    ]
}
```