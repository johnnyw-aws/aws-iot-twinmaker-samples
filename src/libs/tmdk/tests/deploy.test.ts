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
      dir: "/tmp/deploy-unit-tests/i-do-not-exist",
    } as Arguments<Options>;
    await expect(handler(argv2)).rejects.toThrow(Error);
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  // TODO fill in test cases
});
