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

type Options = {
  name: string;
  upper: boolean | undefined;
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
  console.log("Not yet implemented");
  process.exit(0);
};
