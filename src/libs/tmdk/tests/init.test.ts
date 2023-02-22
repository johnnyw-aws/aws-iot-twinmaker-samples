// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { handler, Options } from '../src/commands/init';
import {Arguments} from "yargs";

import {
  ConflictException,
  CreateComponentTypeRequest,
  ResourceNotFoundException, ValidationException,
  GetWorkspaceCommand, IoTTwinMakerClient, GetWorkspaceCommandOutput
} from "@aws-sdk/client-iottwinmaker";

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { return undefined as never });

import {GetWorkspaceCommandInput} from "@aws-sdk/client-iottwinmaker/dist-types/commands/GetWorkspaceCommand";

// TODO uncomment to enable mocking behavior
// jest.mock("../src/lib/aws-clients", () => {
//   return {
//     initDefaultAwsClients: () => {},
//
//     getDefaultAwsClients: jest.fn().mockImplementation(() => {
//       return {
//         tm: {
//           getWorkspace: (input: GetWorkspaceCommandInput) => {
//             console.log(`intercepted ws: ${input.workspaceId}`);
//
//             if (`${input.workspaceId}` == 'non-existent') {
//               throw new ResourceNotFoundException({"$metadata": {}})
//             } else if (`${input.workspaceId}` == 'error') {
//               throw new Error("mock error");
//             } else {
//               return {};
//             }
//           }
//         }
//       }
//     }),
//   }
// })

describe('testing init', () => {
  test('test01', () => {
    var argv2 = {
      _: [ 'init' ],
      '$0': 'tmdk_local',
      region: "us-east-1",
      "workspace-id": "SyncB",
      out: "/tmp/integ-test-init"
    } as Arguments<Options>;
    return handler(argv2).then(result => expect(result).toBe(0));
  }, 120000);
});