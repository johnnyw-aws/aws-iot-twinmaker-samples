// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { handler, Options } from "../src/commands/audit";
import { Arguments } from "yargs";
import { GetWorkspaceCommand, IoTTwinMakerClient, ResourceNotFoundException } from '@aws-sdk/client-iottwinmaker';
import { mockClient } from 'aws-sdk-client-mock';

const twinmakerMock = mockClient(IoTTwinMakerClient);

// TODO add tests after implementation

test("throws error when given workspace that does not exist", async () => {
  twinmakerMock
    .on(GetWorkspaceCommand)
    .rejects(new ResourceNotFoundException({ $metadata: {}, message: "" }));

  const argv2 = {
    _: ["audit"],
    $0: "tmdk_local",
    region: "us-east-1",
    "workspace-id": "non-existent",
  } as Arguments<Options>;
  await expect(handler(argv2)).rejects.toThrow(ResourceNotFoundException);
});
