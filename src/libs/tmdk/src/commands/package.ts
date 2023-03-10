// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Arguments, CommandBuilder } from "yargs";

export type Options = {
  region: string;
  "workspace-id": string;
  "grafana-workspace-id": string;
};

export const command = "package";
export const desc =
  "Packages a tmdk application into a deployable artifact (e.g. CFN)";

export const builder: CommandBuilder<Options> = (yargs) =>
  yargs.options({
    dir: {
      type: "string",
      require: true,
      description: "Specify the project location, directory for tmdk.json file",
      // defaultDescription: "$WORKSPACE_ID",
      // default: process.env.WORKSPACE_ID,
    },
  });

// temporarily disable eslint while not implemented
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = async (argv: Arguments<Options>) => {
  console.log("Not yet implemented");
  return 0;
};
