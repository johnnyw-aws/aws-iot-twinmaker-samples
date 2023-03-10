# AWS IoT TwinMaker Development Kit

This package contains functionality for the AWS IoT TwinMaker Development Kit (TMDK), a set of tools to aid in [IoT TwinMaker](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html) project management. 


TMDK can snapshot an existing TwinMaker workspace (init), deploy this snapshot into any other existing workspace (deploy), and easily delete all entities, component types, and scenes from a workspace (nuke).

You can follow [AWS IoT TwinMaker Getting Started](https://github.com/aws-samples/aws-iot-twinmaker-samples) to setup a sample TwinMaker workspace.


## Setting up TMDK

First clone the latest tip of this tool:

```
git clone https://github.com/johnnyw-aws/aws-iot-twinmaker-samples --depth 1 --branch main-tmdk && cd aws-iot-twinmaker-samples/src/libs/tmdk
```

Navigate to the `tmdk` directory and install any node dependencies:

```
cd src/libs/tmdk
npm install
```
Build the package:
```
npm run build
```

This will build a node executable named `tmdk_local` on your machine. Run the following from the tmdk directory to verify if it was installed correctly.

```
./tmdk_local -h
```
If this command ran successfully without error, `tmdk` properly installed.

If you wish to install `tmdk` globally, first verify that you have permissions to globally install node packages and run:

```
npm run build-global
```

You should now be able to run the following from anywhere on your machine:
```
tmdk -h
```

___


## Bootstrap a TMDK project from an existing workspace

The following will initialize a tmdk project at the specified directory with a `tmdk.json` file

```
tmdk init --region [REGION] --workspace-id [WORKSPACE_ID] --out [PROJECT_DIRECTORY]
```
For example:
```
tmdk init --region us-east-1 --workspace-id CookieFactory0601 --out /tmp/testproj
```

___

## Deploy a tmdk project to another workspace

The following will deploy a tmdk project at the specified directory (the directory must contain a `tmdk.json` file) into the specified workspace.

```
tmdk deploy --region [REGION] --workspace-id [DESTINATION_WORKSPACE_ID] --dir [PROJECT_DIRECTORY]
```
For example:
```
tmdk deploy --region us-east-1 --workspace-id SyncB --dir /tmp/testproj
```

___

## Nuke a workspace

The following will delete all entities, component types, and scenes from a workspace so that the workspace can be deleted.

Warning: This command is destructive. Please take caution before running this command.

```
tmdk nuke --region [REGION] --workspace-id [WORKSPACE_TO_DELETE_RESOURCES_FOR]

```
For example:
```
tmdk nuke --region us-east-1 --workspace-id SyncB
```
___
## Uninstall
To uninstall the TMDK package globally, run:
```
npm uninstall -g tmdk
```
