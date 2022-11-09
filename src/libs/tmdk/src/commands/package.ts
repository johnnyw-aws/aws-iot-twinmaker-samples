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

export type Options = {
  region: string | undefined;
  "workspace-id": string | undefined;
  "grafana-workspace-id": string | undefined;
};

export const command: string = 'package';
export const desc: string = 'Packages a tmdk application into a deployable artifact (e.g. CFN)';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
      "dir": {
        type: "string",
        require: true,
        description: "Specify the project location, directory for tmdk.json file",
        // defaultDescription: "$WORKSPACE_ID",
        // default: process.env.WORKSPACE_ID,
      }
    });

export const handler = async (argv: Arguments<Options>) => {
  console.log("Not yet implemented");
  return 0;
};