// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { handler, Options } from '../src/commands/deploy';
import { Arguments } from "yargs";
import { ResourceNotFoundException } from "@aws-sdk/client-iottwinmaker";
import { GetWorkspaceCommandInput } from "@aws-sdk/client-iottwinmaker/dist-types/commands/GetWorkspaceCommand";

const mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => { throw new Error('process.exit: ' + number); });

jest.mock("../src/lib/aws-clients", () => {
  return {
    initDefaultAwsClients: () => {},

    getDefaultAwsClients: jest.fn().mockImplementation(() => {
      return {
        tm: {
          getWorkspace: (input: GetWorkspaceCommandInput) => {
            console.log(`intercepted ws: ${input.workspaceId}`);

            if (`${input.workspaceId}` == 'non-existent') {
              throw new ResourceNotFoundException({"$metadata": {}, "message": ""})
            } else {
              return {};
            }
          }
        }
      }
    }),
  }
})

describe('testing deploy', () => {
  beforeEach(mockExit.mockClear);

  test('deploy_givenNoTMDKProject_expectError', async () => {
    var argv2 = {
      _: [ 'deploy' ],
      '$0': 'tmdk_local',
      region: "us-east-1",
      "workspace-id": "irrelevant",
      dir: "/tmp/deploy-unit-tests/i-do-not-exist"
    } as Arguments<Options>;
    await expect(handler(argv2)).rejects.toThrow(Error);
    expect(mockExit).toHaveBeenCalledWith(1);
  }, 120000);
});