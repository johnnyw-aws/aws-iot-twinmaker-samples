# AWS IoT TwinMaker Cookie Factory Demo: Web Application

## Prerequisites

1. Node.js 16.x installed in your development environment.
2. NPM 8.x installed in your development environment.
4. The Cookie Factory Demo CDK project deployed to an AWS IoT TwinMaker workspace.

## Configure

**Note: the files referenced in the following steps are relative to the directory containing this README.**

1. Change `WORKSPACE_ID` in `src/config/sites.ts` to your AWS IoT TwinMaker workspace ID.
2. Follow the [Amazon Cognito set-up instructions](./COGNITO_SAMPLE_SETUP_CONSOLE.md) to create the application user account.
3. Set the Amazon Cognito credentials in `src/config/cognito.template.ts` and `src/config/user.template.ts`, renaming the files to `src/config/cognito.ts` and `src/config/users.ts`, respectively.

## Install

```shell
npm install
```

## Development server

```shell
npm run dev
```
- Navigate to `localhost:5000` to view the application, which may take a minute to load the first time.  
- **Note: edit the localhost port as necessary in `webpack.dev.js` (defaults to 5000).**

## Build

```shell
npm run build
```
---

## License

This project is licensed under the Apache-2.0 License.
