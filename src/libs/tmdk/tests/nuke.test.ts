// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { handler, Options } from "../src/commands/nuke";
import { Arguments } from "yargs";
import { mockExit } from "./test-utils";

jest.mock("../src/lib/aws-clients");

describe("testing nuke", () => {
  beforeEach(mockExit.mockClear);

  test("audit_givenNoWorkspace_expectError", async () => {
    const argv2 = {
      _: ["nuke"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": "non-existent",
    } as Arguments<Options>;
    await expect(handler(argv2)).rejects.toThrow(Error);
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test("nuke_givenNoWorkspace_expectError", async () => {
    // TODO
  });

  test("nuke_givenNotYInput_expectExit", async () => {
    // TODO
  });

  test("nuke_givenNoResources_expectSuccess", async () => {
    // TODO
  });

  test("nuke_givenEntities_expectSuccess", async () => {
    // TODO
  });

  test("nuke_givenComponentTypes_expectSuccess", async () => {
    // TODO
  });

  test("nuke_givenScenes_expectSuccess", async () => {
    // TODO
  });

  test("nuke_givenAll_expectSuccess", async () => {
    // TODO
  });
});
