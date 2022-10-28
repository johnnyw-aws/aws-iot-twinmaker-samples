// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CreateComponentTypeRequest,
  ResourceNotFoundException,
} from "@aws-sdk/client-iottwinmaker";
import { getDefaultAwsClients as aws } from "./aws-clients";

type ComponentTypeDefinition = Omit<CreateComponentTypeRequest, "workspaceId">;

interface ComponentTypeProvider {
  (): Promise<ComponentTypeDefinition>;
}

function fromComponentTypeDefinition(
  componentTypeDefinition: ComponentTypeDefinition
): ComponentTypeProvider {
  return () => {
    return new Promise((resolve) => resolve(componentTypeDefinition));
  };
}

async function createComponentTypeIfNotExists(
  workspaceId: string,
  componentTypeDefinition: ComponentTypeDefinition
) {
  try {
    await aws().tm.getComponentType({
      workspaceId,
      componentTypeId: componentTypeDefinition.componentTypeId,
    });

    // console.log(
    //   `Skipped ComponentType ${componentTypeDefinition.componentTypeId}`
    // ); // TODO verbose logging
    return true;
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      await aws().tm.createComponentType({
        workspaceId,
        ...componentTypeDefinition,
      });

      // console.log(
      //   `Created ComponentType ${componentTypeDefinition.componentTypeId}`
      // ); // TODO verbose logging
    } else {
      throw error;
    }

    return false;
  }
}

async function waitForComponentTypeActive(
    workspaceId: string,
    componentTypeId: string
) {
  while(true) { // TODO timeout
    try {
      var result = await aws().tm.getComponentType({
        workspaceId,
        componentTypeId: componentTypeId,
      });

      // console.log(
      //     `${componentTypeId} state: ${result.status?.state}`
      // ); // TODO verbose logging option
      if(!result.status?.state?.toLowerCase().endsWith("ing")) {
        return;
      }
      await new Promise(f => setTimeout(f, 1000)); // sleep
    } catch (error) {
      console.log(`${componentTypeId} still not found...`)
    }
  }
}

export {
  ComponentTypeDefinition,
  ComponentTypeProvider,
  fromComponentTypeDefinition,
  createComponentTypeIfNotExists,
  waitForComponentTypeActive,
};
