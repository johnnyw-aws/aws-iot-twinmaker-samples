
# TwinMaker Cookie Factory Demo: Web Application

## Prerequisites

1. Node.js 16.x installed in your development environment.
1. NPM 8.x installed in your development environment.

```
## Configure

1. Create an AWS IoT TwinMaker workspace.
1. Deploy the Cookie Factory Demo project to the workspace.
1. Change `WORKSPACE_ID` in `src/config/sites.ts` the your workspace ID.
1. Create Amazon Cognito Identity and User Pools.

  * should add details / scripts to support customers new to AWS...

1. Create and verify one or more user accounts in the user pool.

  * should add details / scripts to support customers new to AWS...
  * should add details on required permissions for the cognito role

1. Set your AWS and Cognito user credentials in: `src/config/cognito.template.ts` and `src/config/user.template.ts` and rename the files to `src/config/cognito.ts` and `src/config/user.ts`, respectively.

  * should be "src/config/users.ts"

## Quick start

npm install

  * TODO: high sev findings should be resolved


npm run dev
```



TypeError: callback.newPasswordRequired is not a function
  
  ? probably some issue in how the user pool was setup?

  aws cognito-idp admin-set-user-password --user-pool-id "us-east-1_OEuHnLn9D"  --username "fran@cookiefactory" --password "fran12" --permanent


User: arn:aws:sts::261053700147:assumed-role/Cognito_cookiefactoryv2identitypoolAuth_Role/CognitoIdentityCredentials is not authorized to perform: iottwinmaker:GetScene on resource: arn:aws:iottwinmaker:us-east-1:261053700147:workspace/CFv2OneClick230308/scene/CookieFactory because no identity-based policy allows the iottwinmaker:GetScene action
ServiceException@webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/node_modules/@aws-sdk/smithy-client/dist-es/exceptions.js?:8:9
IoTTwinMakerServiceException@webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/node_modules/@aws-sdk/client-iottwinmaker/dist-es/models/IoTTwinMakerServiceException.js?:9:9

  updated Auth user role to have twinmaker + s3 permissions

_a[componentName] is undefined
completeDataStreams/<@webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/dist/es/time-series-data/completeDataStreams.js?:19:135
completeDataStreams@webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/dist/es/time-series-data/completeDataStreams.js?:15:73
emit@webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/dist/es/time-series-data/subscribeToTimeSeriesData.js?:14:99
@webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/dist/es/time-series-data/subscribeToTimeSeriesData.js?:22:9
addSubscription/unsubscribe<@webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/core/dist/es/data-module/subscription-store/subscriptionStore.js?:66:106
DataCache/this.subscribe/subscription<@webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/core/dist/es/data-module/data-cache/dataCacheWrapped.js?:51:21
ConsumerObserver.prototype.next@webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/rxjs/dist/esm5/internal/Subscriber.js?:111:33

in chrome:

annot read properties of undefined (reading 'properties')
TypeError: Cannot read properties of undefined (reading 'properties')
    at eval (webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/dist/es/time-series-data/completeDataStreams.js?:19:162)
    at Array.map (<anonymous>)
    at completeDataStreams (webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/dist/es/time-series-data/completeDataStreams.js?:15:73)
    at emit (webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/dist/es/time-series-data/subscribeToTimeSeriesData.js?:14:99)
    at Object.eval [as emit] (webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/source-iottwinmaker/dist/es/time-series-data/subscribeToTimeSeriesData.js?:22:9)
    at eval (webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/core/dist/es/data-module/subscription-store/subscriptionStore.js?:66:106)
    at Object.eval [as next] (webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/@iot-app-kit/core/dist/es/data-module/data-cache/dataCacheWrapped.js?:51:17)
    at ConsumerObserver.next (webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/rxjs/dist/esm5/internal/Subscriber.js?:111:33)
    at Subscriber._next (webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/rxjs/dist/esm5/internal/Subscriber.js?:78:26)
    at Subscriber.next (webpack://@amzn/chrisbol-cookiefactorydemo/./node_modules/rxjs/dist/esm5/internal/Subscriber.js?:49:18)

  ? seems these are with the time-series connectivity?
    can close the dialog and see scene + graph