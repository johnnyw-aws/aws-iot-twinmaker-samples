// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { randomBytes } from "crypto";
import { getDefaultAwsClients as aws } from "./aws-clients";
import { ResourceNotFoundException } from "@aws-sdk/client-iottwinmaker";

/**
 * Helper function to wait for set amount of time
 * @param ms number of ms to wait
 */
async function delay(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Simple function for ID generation
 * @returns random hex string
 */
function createUniqueId() {
  const uniqueId = randomBytes(4).toString("hex");
  return uniqueId;
}

/**
 * Helper function during workspace nuke for determining existance of workspace
 * @param workspaceId TM workspace
 * @returns promise boolean
 */
async function verifyWorkspaceExists(workspaceId: string ) {
  try {
    await aws().tm.getWorkspace({ workspaceId: workspaceId });
  } catch (e) {
    if (e instanceof ResourceNotFoundException) {
      console.error(`Error: workspace '${workspaceId}' not found. Please create it first.`);
      throw e;
    } else {
      console.error(`Failed to get workspace.`, e);
      throw e;
    }
  }
  console.log(`Verified workspace ${workspaceId} exists.`);
}

export { delay, createUniqueId, verifyWorkspaceExists };
