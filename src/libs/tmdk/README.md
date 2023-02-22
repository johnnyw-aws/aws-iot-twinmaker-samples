**Note: this project should be treated as "Experimental" and is not yet fully supported by AWS for production use. (Currently only supported on OSX / Linux)**

This package contains functionality for the AWS IoT TwinMaker Development Kit (tmdk), a set of tools to aid in IoT TwinMaker project management.

### Install

Can run following to only clone latest tip of this tool:

```
git clone https://github.com/johnnyw-aws/aws-iot-twinmaker-samples --depth 1 --branch main-tmdk && cd aws-iot-twinmaker-samples/src/libs/tmdk
```

From `tmdk` directory:

```
npm install
```

```
npm run build
```

This will build a node executable named `tmdk_local` (TwinMaker Development Kit) on your machine. Run the following from the tmdk directory to verify if it was installed correctly (should not give errors)

`./tmdk_local -h`

To install `tmdk` globally on your machine (check that you have permissions to globally install node packages), run the following:

```
npm run build-global
```

You should then be able to run `tmdk -h` from anywhere on your machine

### Bootstrap a tmdk project from existing workspace

The following will initialize a tmdk project at the specified directory with a `tmdk.json` file

```
tmdk init --region [REGION] --workspace-id [WORKSPACE_ID] --out [PROJECT_DIRECTORY]
```

e.g. `tmdk init --region us-east-1 --workspace-id CookieFactory0601 --out /tmp/testproj`


### Deploy a tmdk project to another workspace

The following will deploy a tmdk project at the specified directory (should contain a `tmdk.json` file) into the specified workspace.

```
tmdk deploy --region [REGION] --workspace-id [DESTINATION_WORKSPACE_ID] --dir [PROJECT_DIRECTORY]
```

e.g. `tmdk deploy --region us-east-1 --workspace-id SyncB --dir /tmp/testproj`

### Uninstall

`npm uninstall -g tmdk`

---

### (Experimental) Nuke a workspace

The following will delete all entities, component types, and scenes from a workspace so that the workspace can be deleted.

Warning: Safeguards and protection checks have not yet been fully implemented, please take care before running this command.

```
tmdk nuke --region [REGION] --workspace-id [WORKSPACE_TO_DELETE_RESOURCES_FOR]
```
