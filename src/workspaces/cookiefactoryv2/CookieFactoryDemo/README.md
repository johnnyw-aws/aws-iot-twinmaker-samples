# AWS IoT TwinMaker Cookie Factory Demo: Web Application

## Prerequisites

1. Node.js 16.x installed in your development environment.
2. NPM 8.x installed in your development environment.
3. An AWS IoT TwinMaker workspace created.
4. The Cookie Factory Demo CDK project deployed to your workspace.

## Configure

Note: files in these steps are in relation to the directory of this README

1. Change `WORKSPACE_ID` in `src/config/sites.ts` to your workspace ID.
2. Create Amazon Cognito Identity and User Pools and create and verify one or more User accounts in the User Pool.
   1. [Console instructions](./COGNITO_SAMPLE_SETUP_CONSOLE.md)
3. Set your AWS and Cognito user credentials in: `src/config/cognito.template.ts` and `src/config/user.template.ts` and rename the files to `src/config/cognito.ts` and `src/config/users.ts`, respectively.

## Install

```shell
npm install
```

## Development server

* Edit `webpack.dev.js` if needed to change the port for the application (default is port 5000)

```shell
npm run dev
```

* Navigate to the application at `localhost:5000` (default) - Note: it may take a minute to load the first time

## Build

```shell
npm run build
```
---

## License

This project is licensed under the Apache-2.0 License.
