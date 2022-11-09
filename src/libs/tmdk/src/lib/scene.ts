// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from "path";
import * as fsPromises from "fs/promises";

import { getDefaultAwsClients as aws } from "./aws-clients";

async function importScene(workspaceId: string, sceneFilePath: string) {
  const ws = await aws().tm.getWorkspace({ workspaceId });
  const s3Arn = ws.s3Location;

  // TODO: this logic doesn't work on non aws regions (e.g. gov)
  const s3Bucket = s3Arn?.replace("arn:aws:s3:::", "");

  const sceneName = path.basename(sceneFilePath, ".json");
  const sceneContent = (await fsPromises.readFile(sceneFilePath)).toString();

  await aws().tm.createScene({
    workspaceId,
    sceneId: sceneName,
    contentLocation: `s3://${s3Bucket}/${sceneName}.json`,
  });

  await aws().s3.putObject({
    Bucket: s3Bucket,
    Key: sceneName + ".json",
    Body: sceneContent,
    ContentType: "application/json",
  });

  console.log(
    `Uploaded ${sceneFilePath} to s3://${s3Bucket}/${sceneName}.json`
  );
}

async function deleteScenes(workspaceId: string) {
  var result = await aws().tm.listScenes({ workspaceId });

  const sceneList = result["sceneSummaries"];
  if (sceneList != undefined) {
    for (const scene of sceneList) {
      var sceneId = scene['sceneId'];
      await aws().tm.deleteScene({workspaceId: workspaceId, sceneId: sceneId})
      console.log(`deleted scene: ${sceneId}`);
    }
  }
  // FIXME handle pagination

}

export { importScene, deleteScenes };