// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { handler, Options } from '../src/commands/init';
import { Arguments } from "yargs";
import { ResourceNotFoundException } from '@aws-sdk/client-iottwinmaker';
import { createDirectory, mockExit } from './test-utils';

const outDir = '/tmp/init-unit-tests';
beforeAll(() => {
  createDirectory(outDir);
});

jest.mock("../src/lib/aws-clients");

describe('testing init', () => {
  beforeEach(mockExit.mockClear);

  test('init_givenNoWorkspace_expectError', async () => {
    var argv2 = {
      _: [ 'init' ],
      '$0': 'tmdk_local',
      region: "us-east-1",
      "workspace-id": "non-existent",
      out: outDir
    } as Arguments<Options>;
    await expect(handler(argv2)).rejects.toThrow(ResourceNotFoundException);
  });

  // TODO fill in test cases
});