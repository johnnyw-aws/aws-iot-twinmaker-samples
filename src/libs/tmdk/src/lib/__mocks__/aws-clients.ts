// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourceNotFoundException } from '@aws-sdk/client-iottwinmaker';
import { GetWorkspaceCommandInput } from '@aws-sdk/client-iottwinmaker/dist-types/commands/GetWorkspaceCommand';

const emptyMock: any = {};
const twinMakerMock: any = {
  getWorkspace: (input: GetWorkspaceCommandInput) => {
    console.log(`intercepted ws: ${input.workspaceId}`);

    if (`${input.workspaceId}` == 'non-existent') {
      throw new ResourceNotFoundException({"$metadata": {}, "message": ""})
    } else if (`${input.workspaceId}` == 'error') {
      throw new Error("mock getWorkspace error");
    } else {
      return {};
    }
  }
};

class AwsClients {
  region: string;

  sts;
  tm;
  iam;
  s3;
  cf;
  kvs;

  constructor(region: string) {
    this.region = region;
    const options = { customUserAgent: 'tmdk/0.0.2', region: region };
    this.sts = emptyMock;
    this.tm = twinMakerMock;
    this.iam = emptyMock;
    this.s3 = emptyMock;
    this.cf = emptyMock;
    this.kvs = emptyMock;
  }
}

let defaultAwsClients: AwsClients | null = null;

function initDefaultAwsClients(options: { region: string }) {
  defaultAwsClients = new AwsClients(options.region);
}

function getDefaultAwsClients() {
  if (!defaultAwsClients) {
    throw new Error(
      "initDefaultAwsClients must be called before calling getDefaultAwsClients"
    );
  }
  return defaultAwsClients;
}

export { initDefaultAwsClients, getDefaultAwsClients, AwsClients };
