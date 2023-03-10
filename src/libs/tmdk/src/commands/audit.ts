// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Arguments, CommandBuilder } from "yargs";

import { ResourceNotFoundException } from "@aws-sdk/client-iottwinmaker";
import {
  getDefaultAwsClients as aws,
  initDefaultAwsClients,
} from "../lib/aws-clients";

export type Options = {
  region: string | undefined;
  "workspace-id": string | undefined;
  "grafana-workspace-id": string | undefined;
};

export const command = "audit";
export const desc =
  "Scans IoT TwinMaker resources for issues (missing permissions, outdated plugin version, unused resources, etc). Explanation analysis for entity/component properties (e.g. inheritance path, isAbstract causes).";

export const builder: CommandBuilder<Options> = (yargs) =>
  yargs.options({
    region: {
      type: "string",
      require: true,
      description: "Specify the AWS region of the workspace.",
    },
    "workspace-id": {
      type: "string",
      require: false,
      description: "Specify the ID of the Workspace to audit.",
      defaultDescription: "$WORKSPACE_ID",
      default: process.env.WORKSPACE_ID,
    },
    "grafana-workspace-id": {
      type: "string",
      require: false,
      description: "Specify the ID of the Grafana Workspace to audit.",
    },
    "grafana-endpoint": {
      type: "string",
      require: false,
      description: "Specify the Grafana endpoint to audit dashboards in.",
    },
  });

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId = argv["workspace-id"];
  const region = argv.region;
  console.log(region);
  console.log(workspaceId);

  console.log("Not yet implemented");

  // verify workspace exists
  if (region) {
    initDefaultAwsClients({ region: region as string });

    if (workspaceId) {
      try {
        console.log("verifying workspace...");
        await aws().tm.getWorkspace({ workspaceId: workspaceId as string });
        console.log(`Verified workspace exists.`);
      } catch (e) {
        if (e instanceof ResourceNotFoundException) {
          console.log(
            `Error: workspace '${workspaceId}' not found in region '${region}'. Please create it first.`
          );
          process.exit(1);
        } else {
          throw new Error(`Failed to get workspace. ${e}`);
        }
      }
    }
  }

  return 0;
};
