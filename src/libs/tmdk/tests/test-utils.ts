// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as fs from "fs";
import * as path from "path";

export const localResourcesDir = path.join(__dirname, "test-resources");

export const workspaceId = "workspaceId";
export const workspaceBucket = "workspaceBucket";
export const s3BucketArn = `arn:aws:s3:::${workspaceBucket}`;
export const s3ContentLocationBase = `s3://${workspaceBucket}/`;

export function createDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
