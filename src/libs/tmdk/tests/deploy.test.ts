// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { handler, Options } from "../src/commands/deploy";
import { Arguments } from "yargs";
import { mockExit } from "./test-utils";

jest.mock("../src/lib/aws-clients");

describe("testing deploy", () => {
  beforeEach(mockExit.mockClear);

  test("deploy_givenNoTMDKProject_expectError", async () => {
    const argv2 = {
      _: ["deploy"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": "irrelevant",
      dir: "i-do-not-exist",
    } as Arguments<Options>;
    await expect(handler(argv2)).rejects.toThrow(
      Error(
        "ENOENT: no such file or directory, open 'i-do-not-exist/tmdk.json'"
      )
    );
  });

  test("deploy_givenNoWorkspace_expectError", async () => {
    // TODO
  });

  test("deploy_givenEmptyProject_expectSuccess", async () => {
    // TODO
  });

  test("deploy_givenJustComponentTypes_expectSuccess", async () => {
    // TODO
  });

  test("deploy_givenJustScenes_expectSuccess", async () => {
    // TODO
  });

  test("deploy_givenJustEntities_expectSuccess", async () => {
    // TODO
  });

  test("deploy_givenFullWorkspace_expectSuccess", async () => {
    // TODO
  });

  test("deploy_givenPartiallyFilledComponentTypes_expectSuccess", async () => {
    // TODO
  });

  test("deploy_givenPartiallyFilledScenes_expectSuccess", async () => {
    // TODO
  });

  test("deploy_givenPartiallyFilledEntities_expectSuccess", async () => {
    // TODO
  });

  test("deploy_givenPartiallyFilledWorkspace_expectSuccess", async () => {
    // TODO
  });
});
