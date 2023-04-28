Using the AWS CLI, run the following commands

Fill in details related to the CDK content previous deployed

```
export ACCOUNT_ID=__FILL_IN__
export WORKSPACE_ID=__FILL_IN__
export STACK_NAME=__FILL_IN__
export REGION=__FILL_IN__

USER_POOL=$(aws cognito-idp create-user-pool --cli-input-json '{"PoolName": "'${STACK_NAME}'","Policies": {"PasswordPolicy": {"MinimumLength": 8,"RequireUppercase": true,"RequireLowercase": true,"RequireNumbers": true,"RequireSymbols": true,"TemporaryPasswordValidityDays": 7}},"UsernameAttributes": ["email"],"VerificationMessageTemplate": {"DefaultEmailOption": "CONFIRM_WITH_CODE"},"MfaConfiguration": "OFF","EmailConfiguration": {"EmailSendingAccount": "COGNITO_DEFAULT"},"AdminCreateUserConfig": {"AllowAdminCreateUserOnly": true},"Schema": [{"Name": "sub","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": false,"Required": true,"StringAttributeConstraints": {"MinLength": "1","MaxLength": "2048"}},{"Name": "name","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "given_name","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "family_name","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "middle_name","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "nickname","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "preferred_username","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "profile","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "picture","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "website","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "email","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "email_verified","AttributeDataType": "Boolean","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false},{"Name": "gender","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "birthdate","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "10","MaxLength": "10"}},{"Name": "zoneinfo","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "locale","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "phone_number","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "address","AttributeDataType": "String","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"StringAttributeConstraints": {"MinLength": "0","MaxLength": "2048"}},{"Name": "updated_at","AttributeDataType": "Number","DeveloperOnlyAttribute": false,"Mutable": true,"Required": false,"NumberAttributeConstraints": {"MinValue": "0"}}],"UsernameConfiguration": {"CaseSensitive": true},"AccountRecoverySetting": {"RecoveryMechanisms": [{"Priority": 1,"Name": "admin_only"}]}}')
USER_POOL_ID=$(echo $USER_POOL | jq -r .UserPool.Id)

USER_POOL_CLIENT=$(aws cognito-idp create-user-pool-client --cli-input-json '{"UserPoolId": "'$USER_POOL_ID'","ClientName": "'$STACK_NAME'","RefreshTokenValidity": 30,"AccessTokenValidity": 60,"IdTokenValidity": 60,"TokenValidityUnits": {"AccessToken": "minutes","IdToken": "minutes","RefreshToken": "days"},"ReadAttributes": ["address","birthdate","email","email_verified","family_name","gender","given_name","locale","middle_name","name","nickname","phone_number","picture","preferred_username","profile","updated_at","website","zoneinfo"],"WriteAttributes": ["address","birthdate","email","family_name","gender","given_name","locale","middle_name","name","nickname","phone_number","picture","preferred_username","profile","updated_at","website","zoneinfo"],"ExplicitAuthFlows": ["ALLOW_REFRESH_TOKEN_AUTH","ALLOW_USER_SRP_AUTH"],"AllowedOAuthFlowsUserPoolClient": false,"PreventUserExistenceErrors": "ENABLED","EnableTokenRevocation": true}')
USER_POOL_CLIENT_ID=$(echo $USER_POOL_CLIENT | jq -r .UserPoolClient.ClientId)

IDENTITY_POOL=$(aws cognito-identity create-identity-pool --cli-input-json '{"IdentityPoolName": "'$STACK_NAME'","AllowUnauthenticatedIdentities": false,"AllowClassicFlow": false,"CognitoIdentityProviders": [{"ProviderName": "cognito-idp.'$REGION'.amazonaws.com/'$USER_POOL_ID'","ClientId": "'$USER_POOL_CLIENT_ID'","ServerSideTokenCheck": false}]}')
IDENTITY_POOL_ID=$(echo $IDENTITY_POOL | jq -r .IdentityPoolId)

FRAN_USER=$(aws cognito-idp admin-create-user --cli-input-json '{"UserPoolId": "'$USER_POOL_ID'","Username": "fran@cookiefactory","UserAttributes": [{"Name": "email_verified","Value": "true"},{"Name": "email","Value": "fran@cookiefactory"}]}')
FRAN_USERNAME=$(echo $FRAN_USER | jq -r .User.Username)
```

* TODO can do CLI commands to setup the roles as well...but may be easier to use CDK at this point...
  * For CDK we probably can't do the admin password reset, may need to be a custom resource

Go to console for the created identity pool to auto-generate roles (can run following command to get the URL)

```
echo "https://${REGION}.console.aws.amazon.com/cognito/pool/?region=${REGION}&id=${IDENTITY_POOL_ID}"
```

Click on "You have not specified roles for this identity pool. Click here to fix it." and generate the Auth and Unauth roles and assign them to the identity pool.

Note: if you have a large number of roles, you may need to use the following CLI command to set the roles instead of using the console

```
aws cognito-identity set-identity-pool-roles --cli-input-json '{"IdentityPoolId": "'$IDENTITY_POOL_ID'","Roles": {"authenticated": "'$AUTH_ROLE_ARN'","unauthenticated": "'$UNAUTH_ROLE_ARN'"}}'
```

