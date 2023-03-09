import {
  GetComponentTypeCommandOutput, GetEntityCommandOutput,
  ListComponentTypesCommandOutput,
  ListEntitiesCommandOutput,
  ListScenesCommandOutput
} from '@aws-sdk/client-iottwinmaker';
import { basicWorkspaceId } from './test-utils';

export const emptyListComponentTypesResp: ListComponentTypesCommandOutput = {
  $metadata: {},
  componentTypeSummaries: [],
  maxResults: 0,
  nextToken: undefined,
  workspaceId: basicWorkspaceId,
};

export const emptyListEntitiesResp: ListEntitiesCommandOutput = {
  $metadata: {},
  entitySummaries: [],
  nextToken: undefined,
};

export const emptyListScenesResp: ListScenesCommandOutput = {
  $metadata: {},
  sceneSummaries: [],
  nextToken: undefined,
};

export const getComponentType1Resp: GetComponentTypeCommandOutput = {
  $metadata: {},
  workspaceId: basicWorkspaceId,
  arn: "componentType1Arn",
  componentTypeId: "componentType1",
  componentTypeName: "componentType1Name",
  creationDateTime: new Date(),
  description: "description",
  status: {
    error: {
      code: "",
      message: "",
    },
    state: "",
  },
  updateDateTime: new Date(),
};

export const oneCtListComponentTypesResp: ListComponentTypesCommandOutput = {
  $metadata: {},
  componentTypeSummaries: [
    {
      arn: getComponentType1Resp.arn,
      componentTypeId: getComponentType1Resp.componentTypeId,
      componentTypeName: getComponentType1Resp.componentTypeName,
      creationDateTime: getComponentType1Resp.creationDateTime,
      description: getComponentType1Resp.description,
      status: {
        error: {
          code: "",
          message: "",
        },
        state: "",
      },
      updateDateTime: getComponentType1Resp.updateDateTime,
    },
  ],
  maxResults: 0,
  nextToken: undefined,
  workspaceId: basicWorkspaceId,
};

export const expectComponentType1 = {
  componentTypeId: getComponentType1Resp.componentTypeId,
  description: getComponentType1Resp.description,
  extendsFrom: getComponentType1Resp.extendsFrom,
  functions: getComponentType1Resp.functions,
  isSingleton: getComponentType1Resp.isSingleton,
  propertyDefinitions: getComponentType1Resp.propertyDefinitions,
};

export const getEntity1Resp: GetEntityCommandOutput = {
  $metadata: {},
  hasChildEntities: false,
  parentEntityId: "$ROOT",
  workspaceId: basicWorkspaceId,
  arn: "componentType1Arn",
  entityId: "entity1",
  entityName: "entity1Name",
  creationDateTime: new Date(),
  description: "description",
  status: {
    error: {
      code: "",
      message: "",
    },
    state: "",
  },
  updateDateTime: new Date(),
};

export const oneEntityListEntitiesResp: ListEntitiesCommandOutput = {
  $metadata: {},
  entitySummaries: [
    {
      arn: getEntity1Resp.arn,
      entityId: getEntity1Resp.entityId,
      entityName: getEntity1Resp.entityName,
      creationDateTime: getEntity1Resp.creationDateTime,
      description: getEntity1Resp.description,
      status: {
        error: {
          code: "",
          message: "",
        },
        state: "",
      },
      updateDateTime: getEntity1Resp.updateDateTime,
    },
  ],
  nextToken: undefined,
};

export const expectEntity1 = {
  components: [],
  description: getEntity1Resp.description,
  entityId: getEntity1Resp.entityId,
  entityName: getEntity1Resp.entityName,
  parentEntityId: getEntity1Resp.parentEntityId,
};

export const scene1 = {
  specVersion: "1.0",
  version: "1",
  unit: "meters",
  properties: {},
  nodes: [
    {
      name: "model1",
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      transformConstraint: {},
      components: [
        {
          type: "ModelRef",
          uri: "model1.glb",
          modelType: "GLB",
        },
      ],
      properties: {},
    },
  ],
  rootNodeIndexes: [0],
  cameras: [],
  rules: {},
};

export const oneSceneListScenesResp: ListScenesCommandOutput = {
  $metadata: {},
  sceneSummaries: [
    {
      sceneId: "scene1",
      contentLocation: "s3://workspace-bucket/scene1.json",
      arn: "scene1Arn",
      creationDateTime: new Date(),
      updateDateTime: new Date(),
      description: "description",
    },
  ],
  nextToken: undefined,
};
