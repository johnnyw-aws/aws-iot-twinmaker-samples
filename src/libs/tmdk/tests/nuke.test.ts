// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { handler, Options } from "../src/commands/nuke";
import { Arguments } from "yargs";
import { mockExit } from "./test-utils";
import { mockClient } from 'aws-sdk-client-mock';
import prompts = require("prompts");
import {
  DeleteComponentTypeCommand,
  DeleteEntityCommand,
  DeleteSceneCommand,
  GetWorkspaceCommand,
  IoTTwinMakerClient,
  ListComponentTypesCommand,
  ListEntitiesCommand,
  ListScenesCommand,
  ResourceNotFoundException,
} from '@aws-sdk/client-iottwinmaker';
import {
  emptyListComponentTypesResp,
  emptyListEntitiesResp,
  emptyListScenesResp,
  getComponentType1Resp,
  getEntity1Resp,
  oneCtListComponentTypesResp,
  oneEntityListEntitiesResp,
  oneSceneListScenesResp,
} from './test-constants';
import { workspaceId } from '../functional-tests/basic-functional/basic-functional-constants';

const twinmakerMock = mockClient(IoTTwinMakerClient);

describe("testing nuke", () => {
  beforeEach(() => {
    twinmakerMock.reset();
    mockExit.mockClear()
  });

  test("audit_givenWorkspaceDoesNotExist_expectError", async () => {
    twinmakerMock
      .on(GetWorkspaceCommand)
      .rejects(new ResourceNotFoundException({ $metadata: {}, message: "" }));

    const argv2 = {
      _: ["nuke"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": "non-existent",
    } as Arguments<Options>;
    await expect(handler(argv2)).rejects.toThrow(ResourceNotFoundException);
  });

  test("nuke_givenNotYInput_expectExit", async () => {
    prompts.inject(["n"]);
    twinmakerMock.on(GetWorkspaceCommand).resolves({});

    const argv2 = {
      _: ["nuke"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": workspaceId,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(0);
  });

  test("nuke_givenNoResources_expectSuccess", async () => {
    prompts.inject(["Y"]);
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolves(emptyListComponentTypesResp);
    twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
    twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

    const argv2 = {
      _: ["nuke"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": workspaceId,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(0);
  });

  test("nuke_given1Entity_expectSuccess", async () => {
    prompts.inject(["Y"]);
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolves(emptyListComponentTypesResp);
    twinmakerMock.on(ListEntitiesCommand)
      .resolvesOnce(oneEntityListEntitiesResp)
      .resolves(emptyListEntitiesResp);
    twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

    const argv2 = {
      _: ["nuke"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": workspaceId,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(1);
    expect((twinmakerMock.commandCalls(DeleteEntityCommand)[0].args[0].input)).toStrictEqual({
      workspaceId: workspaceId,
      entityId: getEntity1Resp.entityId,
      isRecursive: true,
    });
    expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(0);
  });

  test("nuke_given1ComponentType_expectSuccess", async () => {
    prompts.inject(["Y"]);
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolvesOnce(oneCtListComponentTypesResp)
      .resolves(emptyListComponentTypesResp);
    twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
    twinmakerMock.on(ListScenesCommand).resolves(emptyListScenesResp);

    const argv2 = {
      _: ["nuke"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": workspaceId,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(1);
    expect((twinmakerMock.commandCalls(DeleteComponentTypeCommand)[0].args[0].input)).toStrictEqual({
      workspaceId: workspaceId,
      componentTypeId: getComponentType1Resp.componentTypeId,
    });
    expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(0);
  });

  test("nuke_givenScenes_expectSuccess", async () => {
    prompts.inject(["Y"]);
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolves(emptyListComponentTypesResp);
    twinmakerMock.on(ListEntitiesCommand).resolves(emptyListEntitiesResp);
    twinmakerMock.on(ListScenesCommand)
      .resolvesOnce(oneSceneListScenesResp)
      .resolves(emptyListScenesResp);

    const argv2 = {
      _: ["nuke"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": workspaceId,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(1);
    expect((twinmakerMock.commandCalls(DeleteSceneCommand)[0].args[0].input)).toStrictEqual({
      workspaceId: workspaceId,
      sceneId: oneSceneListScenesResp.sceneSummaries![0].sceneId
    });
  });

  test("nuke_givenAll_expectSuccess", async () => {
    prompts.inject(["Y"]);
    twinmakerMock.on(GetWorkspaceCommand).resolves({});
    twinmakerMock
      .on(ListComponentTypesCommand)
      .resolvesOnce(oneCtListComponentTypesResp)
      .resolves(emptyListComponentTypesResp);
    twinmakerMock.on(ListEntitiesCommand)
      .resolvesOnce(oneEntityListEntitiesResp)
      .resolves(emptyListEntitiesResp);
    twinmakerMock.on(ListScenesCommand)
      .resolvesOnce(oneSceneListScenesResp)
      .resolves(emptyListScenesResp);

    const argv2 = {
      _: ["nuke"],
      $0: "tmdk_local",
      region: "us-east-1",
      "workspace-id": workspaceId,
    } as Arguments<Options>;
    expect(await handler(argv2)).toBe(0);
    expect(twinmakerMock.commandCalls(DeleteEntityCommand).length).toBe(1);
    expect((twinmakerMock.commandCalls(DeleteEntityCommand)[0].args[0].input)).toStrictEqual({
      workspaceId: workspaceId,
      entityId: getEntity1Resp.entityId,
      isRecursive: true,
    });
    expect(twinmakerMock.commandCalls(DeleteComponentTypeCommand).length).toBe(1);
    expect((twinmakerMock.commandCalls(DeleteComponentTypeCommand)[0].args[0].input)).toStrictEqual({
      workspaceId: workspaceId,
      componentTypeId: getComponentType1Resp.componentTypeId,
    });
    expect(twinmakerMock.commandCalls(DeleteSceneCommand).length).toBe(1);
    expect((twinmakerMock.commandCalls(DeleteSceneCommand)[0].args[0].input)).toStrictEqual({
      workspaceId: workspaceId,
      sceneId: oneSceneListScenesResp.sceneSummaries![0].sceneId
    });
  });
});
