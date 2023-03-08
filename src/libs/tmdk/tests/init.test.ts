// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { handler, Options } from "../src/commands/init";
import { Arguments } from "yargs";
import { ResourceNotFoundException } from "@aws-sdk/client-iottwinmaker";
import { createDirectory, mockExit } from "./test-utils";

const outDir = "/tmp/init-unit-tests";
beforeAll(() => {
  createDirectory(outDir);
});

jest.mock("../src/lib/aws-clients");

describe("testing init", () => {
  beforeEach(mockExit.mockClear);

  test("init_givenNoWorkspace_expectError", async () => {
    const argv2 = {
      _: ["init"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": "non-existent",
      out: outDir,
    } as Arguments<Options>;
    await expect(handler(argv2)).rejects.toThrow(ResourceNotFoundException);
  });

  test("init_givenWorkspaceDoesNotExist_expectEmptyProject", async () => {
    // TODO
  });

  test("init_givenNoResources_expectJustWorkspace", async () => {
    // TODO
  });

  test("init_givenJustComponentTypes_expectSuccess", async () => {
    // TODO
  });

  test("init_givenJustScenes_expectSuccess", async () => {
    // TODO
  });

  test("init_givenJustEntities_expectSuccess", async () => {
    // TODO
  });

  test("init_givenFullWorkspace_expectSuccess", async () => {
    // TODO
  });
});
