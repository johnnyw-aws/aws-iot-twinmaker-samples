# TwinMaker Cookie Factory Demo: Web Application

## Prerequisites

1. Node.js 16.x installed in your development environment.
1. NPM 8.x installed in your development environment.

## Configure

1. Create an AWS IoT TwinMaker workspace.
2. Deploy the Cookie Factory Demo project to the workspace.
3. Change `WORKSPACE_ID` in `src/config/sites.ts` to your workspace ID.
4. Create Amazon Cognito Identity and User Pools.
5. Create and verify one or more user accounts in the user pool.
   1. [Console instructions](./COGNITO_SAMPLE_SETUP_CONSOLE.md)
6. Set your AWS and Cognito user credentials in: `src/config/cognito.template.ts` and `src/config/user.template.ts` and rename the files to `src/config/cognito.ts` and `src/config/users.ts`, respectively.

## Install

```shell
npm install
```

## Development server

```shell
npm run dev
```

## Build

```shell
npm run build
```
