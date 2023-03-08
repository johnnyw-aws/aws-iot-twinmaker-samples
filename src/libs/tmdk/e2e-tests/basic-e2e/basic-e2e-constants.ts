// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from "path";
import * as os from "os";

export const localResourcesDir = path.join(__dirname, "basic-e2e-resources");
export const timestamp = Date.now() % 10000;
export const workspaceId = `tmdk-e2e-test-workspace-${timestamp}`;
export const region = "us-east-1";
export const tmdkDirectory = path.join(os.tmpdir(), "e2e-tmdk-test");
export const tmdkFile = "tmdk.json";
export const entitiesFile = "entities.json";

export const componentType1Input = {
  workspaceId: workspaceId,
  componentTypeId: "testComponentType1",
};

export const componentType2Name = "testComponentType2";
export const componentType2 = {
  workspaceId: workspaceId,
  componentTypeId: "testComponentType2",
};

export const scene1FileName = "testScene1.json";
export const scene2FileName = "testScene2.json";

export const scene1Input = {
  workspaceId: workspaceId,
  sceneId: "testScene1",
  contentLocation: "contentLocation",
};

export const entity1Input = {
  workspaceId: workspaceId,
  entityName: "testEntity1",
};

export const entity2Definition = {
  components: {},
  description: "",
  entityName: "testEntity2",
  parentEntityId: "$ROOT",
};

export const model1FileName = "CookieFactoryMixer.glb";
export const model2FileName = "CookieFactoryWaterTank.glb";

export const resourceActiveState = "ACTIVE";
export const jsonEncoding = "utf-8";

export const expectedTmdk = {
  version: "0.0.2",
  "component-types": ["testComponentType1.json"],
  scenes: ["testScene1.json"],
  models: ["CookieFactoryMixer.glb"],
  entities: "entities.json",
};
