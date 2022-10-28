// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Arguments, CommandBuilder } from 'yargs';

import {
  ConflictException,
  CreateComponentTypeRequest,
  ResourceNotFoundException, ValidationException,
} from "@aws-sdk/client-iottwinmaker";
import {getDefaultAwsClients as aws, initDefaultAwsClients} from "../lib/aws-clients";
import * as fs from "fs";
import {createComponentTypeIfNotExists, waitForComponentTypeActive} from "../lib/component-type";
import {importScene} from "../lib/scene";
import {importResource} from "../lib/resource";
import {EntityDefinition, importEntities} from "../lib/entity";
import {prepareWorkspace} from "../lib/workspace";

type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = 'deploy';
export const desc: string = 'Deploys a tmdk application';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    // .options({
    //   upper: { type: 'boolean' },
    // })
    // .positional('workspace-id', { type: 'string', demandOption: true });
    .options({
      region: {
        type: "string",
        require: true,
        description: "Specify the AWS region to deploy to.",
        defaultDescription: "$AWS_DEFAULT_REGION",
        default: process.env.AWS_DEFAULT_REGION,
      },
      "workspace-id": {
        type: "string",
        require: true,
        description: "Specify the ID of the Workspace to deploy to.",
        defaultDescription: "$WORKSPACE_ID",
        default: process.env.WORKSPACE_ID,
      },
      "dir": {
        type: "string",
        require: true,
        description: "Specify the project location, directory for tmdk.json file",
        // defaultDescription: "$WORKSPACE_ID",
        // default: process.env.WORKSPACE_ID,
      }
    });
// .middleware([
//   (args) => {
//     initDefaultAwsClients({ region: args.region });
//   },
// ])

function syncReadFile(path: string) {
  const result = fs.readFileSync(path, 'utf-8');
  return `${result}`; // TODO more idiomatic
}

export const handler = async (argv: Arguments<Options>) => {
  const { name, upper } = argv; // TODO figure out idiomatc usage of yargs
  const { region, workspaceId, dir } = argv; // TODO idiomatic usage
  // const region = argv.region;
  // console.log(argv);
  const workspaceIdStr = `${workspaceId}`; // TODO idiomatic
  const greeting = `Hello4, ${workspaceIdStr} in ${region}!\n`;
  // process.stdout.write(upper ? greeting.toUpperCase() : greeting);
  console.log(`Deploying project from directory ${dir} into workspace ${workspaceIdStr} in ${region}`)

  initDefaultAwsClients({ region: `${region}` }); // TODO idiomatic
  // var result = await aws().tm.listWorkspaces({});
  // console.log(result);

  // read tmdk json file
  var tmdk_config_buffer = fs.readFileSync(`${dir}/tmdk.json`, 'utf-8'); // TODO encodings
  var tmdk_config_str = `${tmdk_config_buffer}`
  var tmdk_config: any = JSON.parse(tmdk_config_str)
  console.log("========= tmdk.json =========")
  console.log(tmdk_config);

  // verify workspace exists
  try {
    await aws().tm.getWorkspace({ workspaceId: workspaceIdStr });
    console.log(`Verified workspace exists.`);
  } catch (e) {
    if (e instanceof ResourceNotFoundException) {
      console.log(`Error: workspace '${workspaceIdStr}' not found in region '${region}'. Please create it first.`)
      process.exit(1);
    } else {
      throw new Error(`Failed to get workspace. ${e}`);
    }
  }

  // // TODO revisit: import workspace bucket/role (probably need role for specialized permissions)
  // import component types into workspace
  if (tmdk_config.hasOwnProperty('component-types')) {
    console.log("====== Component Types ======")
    var stillComponentRemaining = true; // FIXME cleaner dependency creation process
    while (stillComponentRemaining) {

      stillComponentRemaining = false;

      for (var componentTypeFile of tmdk_config['component-types']) {
        // console.log(componentTypeFile);
        var componentTypeDefinitionStr = syncReadFile(`${dir}/${componentTypeFile}`)
        // console.log(componentTypeDefinitionStr);
        var componentTypeDefinition = JSON.parse(componentTypeDefinitionStr)

        // create component type if not exists
        // console.log(`Creating component type: ${componentTypeDefinition['componentTypeId']} ...`) // TODO verbose logging
        try {
          var alreadyExists = await createComponentTypeIfNotExists(
            workspaceIdStr,
            componentTypeDefinition
          );
          await waitForComponentTypeActive(workspaceIdStr, componentTypeDefinition['componentTypeId']);
          if (!alreadyExists) {
            console.log(`Created component-type: ${componentTypeDefinition['componentTypeId']}`)
          }
        } catch (error) {
          if (error instanceof ValidationException) {
            // TODO check message is due to something not existing in workspace
            // console.log(`retry creation of ${componentTypeDefinition['componentTypeId']} later due to validation exception... ${error}`)
            stillComponentRemaining = true
          } else {
            throw error;
          }
        }
      }
    }
  }

  // import scenes
  if (tmdk_config.hasOwnProperty('scenes')) {
    console.log("======== Scene Files ========")
    for (var sceneFile of tmdk_config['scenes']) {
      console.log(`Importing scene: ${sceneFile} ...`)
      try {
        await importScene(workspaceIdStr, `${dir}/${sceneFile}`)
      } catch (error) {
        if (error instanceof ConflictException) {
          console.log(`  ...skipping scene creation for ${sceneFile} due to pre-existing scene with same id`); // TODO should scan and warn instead
        } else {
          throw error;
        }
      }
    }
  }
  // import model files
  if (tmdk_config.hasOwnProperty('models')) {
    console.log("======== Model Files ========")
    for (var modelFile of tmdk_config['models']) {
      console.log(`Importing model: ${modelFile} ...`)
      await importResource(workspaceIdStr, `${dir}/3d_models/${modelFile}`, `${modelFile}`)
    }
  }

  if (tmdk_config.hasOwnProperty('entities')) {
    console.log("========== Entities =========")
    var entityDefinitions: EntityDefinition[];
    var entityFileName = tmdk_config['entities'];
    var entityFileJson = JSON.parse(syncReadFile(`${dir}/${entityFileName}`).toString());
    // const entityFileJson = JSON.parse((await fsPromises.readFile(argv.entityFilePath)).toString());
    await importEntities(workspaceIdStr, entityFileJson)
  }


  console.log("=== Deployment Completed! ===")
  process.exit(0);
};
