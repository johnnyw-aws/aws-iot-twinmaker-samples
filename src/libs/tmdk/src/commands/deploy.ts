/* eslint-disable no-prototype-builtins */
// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Arguments, CommandBuilder } from "yargs";

import {
  ConflictException,
  ResourceNotFoundException,
  ValidationException,
} from "@aws-sdk/client-iottwinmaker";
import {
  getDefaultAwsClients as aws,
  initDefaultAwsClients,
} from "../lib/aws-clients";
import * as fs from "fs";
import {
  createComponentTypeIfNotExists,
  waitForComponentTypeActive,
} from "../lib/component-type";
import { importScene } from "../lib/scene";
import { importResource } from "../lib/resource";
import { syncEntities } from "../lib/sync";

export type Options = {
  region: string | undefined;
  "workspace-id": string | undefined;
  dir: string | undefined;
};

export const command = "deploy";
export const desc = "Deploys a tmdk application";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
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
    dir: {
      type: "string",
      require: true,
      description: "Specify the project location, directory for tmdk.json file",
      // defaultDescription: "$WORKSPACE_ID",
      // default: process.env.WORKSPACE_ID,
    },
  });

function syncReadFile(path: string) {
  const result = fs.readFileSync(path, "utf-8");
  return `${result}`; // TODO more idiomatic
}

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId = argv["workspace-id"] as string; // TODO allow it to be optional
  const region = argv.region;
  const dir = argv.dir;
  const workspaceIdStr = `${workspaceId}`; // TODO idiomatic
  console.log(
    `Deploying project from directory ${dir} into workspace ${workspaceIdStr} in ${region}`
  );

  initDefaultAwsClients({ region: `${region}` }); // TODO idiomatic
  // read tmdk json file
  const tmdk_config_buffer = fs.readFileSync(`${dir}/tmdk.json`, "utf-8"); // TODO encodings
  const tmdk_config_str = `${tmdk_config_buffer}`;
  const tmdk_config = JSON.parse(tmdk_config_str);
  console.log("========= tmdk.json =========");
  console.log(tmdk_config);

  // verify workspace exists
  let workspaceContentBucket = "";
  try {
    const workspaceDesc = await aws().tm.getWorkspace({
      workspaceId: workspaceIdStr,
    });
    if (workspaceDesc["s3Location"]) {
      workspaceContentBucket = workspaceDesc["s3Location"]
        .split(":")
        .slice(-1)[0];
    }
    console.log(`Verified workspace exists.`);
  } catch (e) {
    if (e instanceof ResourceNotFoundException) {
      console.log(
        `Error: workspace '${workspaceIdStr}' not found in region '${region}'. Please create it first.`
      );
      process.exit(1);
    } else {
      throw new Error(`Failed to get workspace. ${e}`);
    }
  }

  // // TODO revisit: import workspace bucket/role (probably need role for specialized permissions)
  // import component types into workspace
  if (tmdk_config.hasOwnProperty("component-types")) {
    console.log("====== Component Types ======");
    let stillComponentRemaining = true; // FIXME cleaner dependency creation process
    while (stillComponentRemaining) {
      stillComponentRemaining = false;
      for (const componentTypeFile of tmdk_config["component-types"]) {
        const componentTypeDefinitionStr = syncReadFile(
          `${dir}/${componentTypeFile}`
        );
        const componentTypeDefinition = JSON.parse(componentTypeDefinitionStr);
        // remove inherited properties
        const propertyDefinitions = componentTypeDefinition[
          "propertyDefinitions"
        ] as object;
        if (propertyDefinitions != undefined) {
          const filtered_property_definitions = Object.entries(
            propertyDefinitions
          ).reduce((acc, [key, value]) => {
            if (!value["isInherited"]) {
              acc[key] = value;
            }
            return acc;
          }, {} as { [key: string]: object });
          componentTypeDefinition["propertyDefinitions"] =
            filtered_property_definitions;
        }
        // create component type if not exists
        try {
          const alreadyExists = await createComponentTypeIfNotExists(
            workspaceIdStr,
            componentTypeDefinition
          );
          await waitForComponentTypeActive(
            workspaceIdStr,
            componentTypeDefinition["componentTypeId"]
          );
          if (!alreadyExists) {
            console.log(
              `Created component-type: ${componentTypeDefinition["componentTypeId"]}`
            );
          }
        } catch (e) {
          if (
            // components are not gaurenteed to be in the correct order; retry
            e instanceof ValidationException &&
            e.message.includes("do not exist in workspace")
          ) {
            stillComponentRemaining = true;
          } else {
            throw new Error(`Failed to create component type. ${e}`);
          }
        }
      }
    }
  }

  // import scenes
  if (tmdk_config.hasOwnProperty("scenes")) {
    console.log("======== Scene Files ========");
    for (const sceneFile of tmdk_config["scenes"]) {
      console.log(`Importing scene: ${sceneFile} ...`);
      try {
        await importScene(
          workspaceIdStr,
          `${dir}/${sceneFile}`,
          workspaceContentBucket
        );
      } catch (error) {
        if (error instanceof ConflictException) {
          console.log(
            `  ...skipping scene creation for ${sceneFile} due to pre-existing scene with same id`
          ); // TODO should scan and warn instead
        } else {
          throw error;
        }
      }
    }
  }
  // import model files
  if (tmdk_config.hasOwnProperty("models")) {
    console.log("======== Model Files ========");
    for (const modelFile of tmdk_config["models"]) {
      console.log(`Importing model: ${modelFile} ...`);
      await importResource(
        workspaceIdStr,
        `${dir}/3d_models/${modelFile}`,
        `${modelFile}`
      );
    }
  }

  if (tmdk_config.hasOwnProperty("entities")) {
    console.log("========== Entities =========");
    const entityFileName = tmdk_config["entities"];
    const entityFileJson = JSON.parse(
      syncReadFile(`${dir}/${entityFileName}`).toString()
    );
    await syncEntities(workspaceIdStr, entityFileJson);
  }

  console.log("=== Deployment Completed! ===");
  return 0;
};
