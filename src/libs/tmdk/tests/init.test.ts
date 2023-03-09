// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { handler, Options } from "../src/commands/init";
import { Arguments } from "yargs";
import {
  GetComponentTypeCommand,
  GetEntityCommand,
  GetWorkspaceCommand,
  IoTTwinMakerClient,
  ListComponentTypesCommand,
  ListEntitiesCommand,
  ListScenesCommand,
  ResourceNotFoundException,
} from "@aws-sdk/client-iottwinmaker";
import { mockClient } from "aws-sdk-client-mock";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SdkStream } from "@aws-sdk/types";
import * as path from 'path';
import { basicWorkspaceId, createDirectory, localResourcesDir } from './test-utils';
import {
  emptyListComponentTypesResp,
  emptyListEntitiesResp,
  emptyListScenesResp, expectComponentType1, expectEntity1,
  getComponentType1Resp,
  getEntity1Resp,
  oneCtListComponentTypesResp, oneEntityListEntitiesResp, oneSceneListScenesResp, scene1
} from './test-constants';
const fs = require("fs");

const outDir = "/tmp/init-unit-tests";
beforeAll(() => {
  createDirectory(outDir);
});

const twinmakerMock = mockClient(IoTTwinMakerClient);
const s3Mock = mockClient(S3Client);

describe("testing init", () => {
  beforeEach(() => {
    s3Mock.reset();
    twinmakerMock.reset();
    jest.spyOn(fs, "writeFileSync");
  });

  test("init_givenWorkspaceDoesNotExist_expectError", async () => {
    twinmakerMock
      .on(GetWorkspaceCommand)
      .rejects(new ResourceNotFoundException({ $metadata: {}, message: "" }));

    const argv2 = {
      _: ["init"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": "non-existent",
      out: outDir,
    } as Arguments<Options>;
    await expect(handler(argv2)).rejects.toThrow(ResourceNotFoundException);
  });

  test("init_givenNoResources_expectEmptyTmdk", async () => {
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolves(emptyListComponentTypesResp);
    twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
    twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

    const argv2 = {
      _: ["init"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": basicWorkspaceId,
      out: outDir,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    const expectedTmdk: any = {
      version: "0.0.2",
      "component-types": [],
      scenes: [],
      models: [],
      entities: "entities.json",
    };
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/tmdk.json`,
      JSON.stringify(expectedTmdk, null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/entities.json`,
      JSON.stringify([], null, 4)
    );
  });

  test("init_given1ComponentType_expectSuccess", async () => {
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolves(oneCtListComponentTypesResp);
    twinmakerMock.on(GetComponentTypeCommand).resolves(getComponentType1Resp);
    twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
    twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

    const argv2 = {
      _: ["init"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": basicWorkspaceId,
      out: outDir,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    const expectedTmdk = {
      version: "0.0.2",
      "component-types": [`${getComponentType1Resp["componentTypeId"]}.json`],
      scenes: [],
      models: [],
      entities: "entities.json",
    };

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/tmdk.json`,
      JSON.stringify(expectedTmdk, null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/entities.json`,
      JSON.stringify([], null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/${getComponentType1Resp["componentTypeId"]}.json`,
      JSON.stringify(expectComponentType1, null, 4)
    );
  });

  test("init_given1SceneAnd1Model_expectSuccess", async () => {
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolves(emptyListComponentTypesResp);
    twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
    twinmakerMock.on(ListScenesCommand).resolves(oneSceneListScenesResp);
    s3Mock
      .on(GetObjectCommand, { Bucket: "workspace-bucket", Key: "scene1.json" })
      .resolves({
        $metadata: {},
        Body: { transformToString: (encoding?: string) =>
          {return Promise.resolve(JSON.stringify(scene1, null, 4));} } as any,
      });
    s3Mock
      .on(GetObjectCommand, { Bucket: "workspace-bucket", Key: "model1.glb" })
      .resolves({
        $metadata: {},
        Body: { transformToString: (encoding?: string) =>
          {return Promise.resolve(fs.readFileSync(path.join(localResourcesDir, "model1.glb")));} } as any,
      });

    const argv2 = {
      _: ["init"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": basicWorkspaceId,
      out: outDir,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    const expectedTmdk = {
      version: "0.0.2",
      "component-types": [],
      scenes: ["scene1.json"],
      models: ["model1.glb"],
      entities: "entities.json",
    };

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/tmdk.json`,
      JSON.stringify(expectedTmdk, null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/entities.json`,
      JSON.stringify([], null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/scene1.json`,
      JSON.stringify(scene1, null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/3d_models/model1.glb`,
      fs.readFileSync(path.join(localResourcesDir, "model1.glb")),
    );
  });

  test("init_givenJustEntities_expectSuccess", async () => {
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolves(emptyListComponentTypesResp);
    twinmakerMock.on(ListEntitiesCommand).resolves(oneEntityListEntitiesResp);
    twinmakerMock.on(GetEntityCommand).resolves(getEntity1Resp);
    twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

    const argv2 = {
      _: ["init"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": basicWorkspaceId,
      out: outDir,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    const expectedTmdk = {
      version: "0.0.2",
      "component-types": [],
      scenes: [],
      models: [],
      entities: "entities.json",
    };
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/tmdk.json`,
      JSON.stringify(expectedTmdk, null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/entities.json`,
      JSON.stringify([expectEntity1], null, 4)
    );
  });

  test("init_givenFullWorkspace_expectSuccess", async () => {
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolves(oneCtListComponentTypesResp);
    twinmakerMock.on(GetComponentTypeCommand).resolves(getComponentType1Resp);
    twinmakerMock.on(ListEntitiesCommand).resolves(oneEntityListEntitiesResp);
    twinmakerMock.on(GetEntityCommand).resolves(getEntity1Resp);
    twinmakerMock.on(ListScenesCommand).resolves(oneSceneListScenesResp);
    s3Mock
      .on(GetObjectCommand, { Bucket: "workspace-bucket", Key: "scene1.json" })
      .resolves({
        $metadata: {},
        Body: { transformToString: (encoding?: string) =>
          {return Promise.resolve(JSON.stringify(scene1, null, 4));} } as any,
      });
    s3Mock
      .on(GetObjectCommand, { Bucket: "workspace-bucket", Key: "model1.glb" })
      .resolves({
        $metadata: {},
        Body: { transformToString: (encoding?: string) =>
          {return Promise.resolve(fs.readFileSync(path.join(localResourcesDir, "model1.glb")));} } as SdkStream<Blob>,
      });

    const argv2 = {
      _: ["init"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": basicWorkspaceId,
      out: outDir,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    const expectedTmdk = {
      version: "0.0.2",
      "component-types": [`${getComponentType1Resp["componentTypeId"]}.json`],
      scenes: ["scene1.json"],
      models: ["model1.glb"],
      entities: "entities.json",
    };

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/tmdk.json`,
      JSON.stringify(expectedTmdk, null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/entities.json`,
      JSON.stringify([expectEntity1], null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/${getComponentType1Resp["componentTypeId"]}.json`,
      JSON.stringify(expectComponentType1, null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/scene1.json`,
      JSON.stringify(scene1, null, 4)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${outDir}/3d_models/model1.glb`,
      fs.readFileSync(path.join(localResourcesDir, "model1.glb")),
    );
  });
});
