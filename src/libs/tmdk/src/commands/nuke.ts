// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Arguments, CommandBuilder } from 'yargs';
const prompts = require('prompts');

import {
  ConflictException,
  CreateComponentTypeRequest,
  ResourceNotFoundException, ValidationException,
} from "@aws-sdk/client-iottwinmaker";
import {getDefaultAwsClients as aws, initDefaultAwsClients} from "../lib/aws-clients";
import * as fs from "fs";
import {createComponentTypeIfNotExists, deleteComponentTypes, waitForComponentTypeActive} from "../lib/component-type";
import {deleteScenes, importScene} from "../lib/scene";
import {importResource} from "../lib/resource";
import {deleteEntities, deleteEntitiesWithServiceRecursion, EntityDefinition, importEntities} from "../lib/entity";
import {workspaceExists} from "../lib/workspace";

export type Options = {
  "workspace-id": string | undefined;
  region: string | undefined;
};

export const command: string = 'nuke';
export const desc: string = 'Deletes an IoT TwinMaker workspace and all its resources';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
      region: {
        type: "string",
        require: true,
        description: "Specify the AWS region of the workspace to delete.",
        defaultDescription: "$AWS_DEFAULT_REGION",
        default: process.env.AWS_DEFAULT_REGION,
      },
      "workspace-id": {
        type: "string",
        require: true,
        description: "Specify the ID of the Workspace to delete.",
        defaultDescription: "$WORKSPACE_ID",
        default: process.env.WORKSPACE_ID,
      }
    });

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId = `${argv["workspace-id"]}`;
  const region = `${argv.region}`;

  initDefaultAwsClients({ region: region });

  if (!workspaceExists(workspaceId)) {
    console.log(`Error: workspace '${workspaceId}' not found in region '${region}'. Exiting.`)
    return 0;
  }

  // TODO also determine the current account
  await (async () => {
    const response = await prompts({
      type: 'text',
      name: 'confirmation',
      message: `Are you sure you wish to delete all entities, component types, and scenes from IoT TwinMaker workspace [${workspaceId}] in region [${region}] ? (Y/n)`
    });

    if (response.confirmation === 'Y') {
      // delete all entities with basic confirmation
      console.log("========== Entities =========")
      await deleteEntitiesWithServiceRecursion(workspaceId);

      // delete all component types with basic confirmation
      console.log("====== Component Types ======")
      await deleteComponentTypes(workspaceId);

      // delete all scenes with confirmation
      console.log("====== Scenes / Models ======")
      await deleteScenes(workspaceId);

      // TODO support delete the workspace + s3 bucket contents + s3 bucket

      console.log(`[Completed] All entities, component-types, and scenes have been deleted from ${workspaceId}. Workspace can now be deleted in console or CLI.`)

    } else {
      console.log("'Y' not entered, cancelling execution.")
    }

  })();

  return 0;
};
