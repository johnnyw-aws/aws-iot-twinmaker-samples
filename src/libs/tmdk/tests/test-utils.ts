// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as fs from "fs";

export const mockExit = jest
  .spyOn(process, "exit")
  .mockImplementation((number) => {
    throw new Error("process.exit: " + number);
  });

export function createDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}