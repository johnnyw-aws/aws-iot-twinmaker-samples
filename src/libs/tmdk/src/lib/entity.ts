// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CreateEntityRequest,
  ListEntitiesFilter,
  ComponentUpdateRequest,
  ParentEntityUpdateRequest, ValidationException, ConflictException
} from "@aws-sdk/client-iottwinmaker";
import { getDefaultAwsClients as aws } from "./aws-clients";
import { delay } from "./utils";

type EntityDefinition = Omit<CreateEntityRequest, "workspaceId">;

async function importEntities(
  workspaceId: string,
  entityDefinitions: EntityDefinition[]
) {

  // FIXME resolve ordering needs
  var done = false;
  var created = 0;
  while (!done) {

    done = true;
    for (const entityDefinition of entityDefinitions) {

      try {
      // TODO: parallize load
      await aws().tm.createEntity({
        workspaceId,
        ...entityDefinition,
      });

      created += 1;
      
      //Throttle API calls
      await delay(100);

      console.log(`Created Entity (${created} / ${entityDefinitions.length}): ${entityDefinition.entityId}`);
      } catch (e) {
        if (e instanceof ValidationException) {
          if (e.message.indexOf("Unable to find parent entity id") >= 0) {
            // console.log(`retry entity later once parent created: ${entityDefinition.entityId}`)
            // skip error may work later
            done = false;
          } else if (e.message.indexOf("already exists") >= 0) {
            // skip error
          } else {
            throw e;
          }
        } else if (e instanceof ConflictException) {
          // skip error
        } else {
          throw e
        }
      }
    }
  }
}
async function recursiveDeleteEntities(workspaceId: string, entityId: string) {
  const filters: ListEntitiesFilter[] = [{ parentEntityId: entityId }];
  const maxResults: number = 200;
  const isRecursive: boolean | undefined = true;
  // first we do a depth first recursive delete to get down to leaf nodes
  while (true) {
    let next_token: string | undefined = "";
    let nextToken: string | undefined = next_token;
    let resp = await aws().tm.listEntities({
      workspaceId,
      filters,
      maxResults,
      nextToken,
    });
    const parentsList = resp["entitySummaries"];
    if (parentsList != undefined) {
      for (const parent of parentsList) {
        if (parent["entityId"] != undefined) {
          await recursiveDeleteEntities(workspaceId, parent["entityId"]);
        }
      }
    }
    nextToken = resp["nextToken"];
    if (nextToken == undefined) {
      break;
    }
  }
  // at this point we have called recursive delete on all of children
  // and will wait for our immediate children to finish deleting
  let resp = await aws().tm.listEntities({
    workspaceId,
    filters,
  });
  let numTries: number = 0;
  while (
    resp["entitySummaries"] != undefined &&
    resp["entitySummaries"].length > 0
  ) {
    console.log(
      `Waiting for children of ${entityId} to finish deleting. ${resp["entitySummaries"].length} remaining.`
    );
    let prevRemaining = resp["entitySummaries"].length;
    await delay(2000);
    resp = await aws().tm.listEntities({
      workspaceId,
      filters,
    });
    // we want to prevent an endless loop if there is an internal error that the script cannot detect
    if (
      resp["entitySummaries"] != undefined &&
      resp["entitySummaries"].length == prevRemaining
    ) {
      // we introduce a limit to the number of tries when our entitySummary length has not changed
      if (numTries++ > 15) {
        throw "Encountered Exception While Deleting Entities. Please check console for more details and retry.";
      }
    } else {
      numTries = 0;
    }
  }
  // children are now deleted so delete self
  if (entityId != "$ROOT") {
    console.log("Deleting entity: " + entityId);
    try {
      await aws().tm.deleteEntity({
        workspaceId,
        entityId,
        isRecursive,
      });
    } catch (e) {
      console.log(`Failed to delete entity: ${entityId}`);
    }
  }
}

async function deleteEntities(workspaceId: string) {
  await recursiveDeleteEntities(workspaceId, "$ROOT");
}

async function deleteEntitiesWithServiceRecursion(workspaceId: string) {
  const filters: ListEntitiesFilter[] = [{ parentEntityId: '$ROOT' }];

  // for each child of $ROOT call delete with service-side recursive deletion flag set to true
  const maxResults: number = 200;
  while (true) {
    let next_token: string | undefined = "";
    let nextToken: string | undefined = next_token;
    let resp = await aws().tm.listEntities({
      workspaceId,
      filters,
      maxResults,
      nextToken,
    });
    const rootEntities = resp["entitySummaries"];
    if (rootEntities != undefined) {
      for (const entity of rootEntities) {
        if (entity["entityId"] != undefined) {
          console.log(`recursively deleting entity: ${entity["entityId"]}`);
          await aws().tm.deleteEntity({
            workspaceId,
            entityId: entity["entityId"],
            isRecursive: true,
          });
        }
      }
    }
    nextToken = resp["nextToken"];
    if (nextToken == undefined) {
      break;
    }
  }

  // wait for all entities to be deleted
  var total_entities_remaining = 1;
  while(total_entities_remaining > 0) {
    total_entities_remaining = 0;
    let next_token: string | undefined = "";
    let nextToken: string | undefined = next_token;
    while (true) {
      let listResp : any = await aws().tm.listEntities({ // TODO why does "any" need to be here but not above?
        workspaceId,
        maxResults,
        nextToken,
      });
      const entities_on_page = listResp["entitySummaries"];
      total_entities_remaining += entities_on_page?.length;
      nextToken = listResp["nextToken"];
      if (nextToken == undefined) {
        break;
      }
    }

    if (total_entities_remaining > 0) {
      console.log(`waiting for entities to finish deleting... (${total_entities_remaining} remaining)`);
      await delay(5000); // call throttling
    }
  }
}

function entity_in_state_transition(error_message: string) {
  if (error_message.indexOf("Cannot update Entity") > -1) {
    if (error_message.indexOf("when it is in CREATING state") > -1) {
      return true;
    } else if (error_message.indexOf("when it is in UPDATING state") > -1) {
      return true;
    }
  }
  return false;
}

async function updateEntity(
  workspaceId: string,
  entityId: string,
  entityName?: string,
  description?: string,
  componentUpdates?: {
    [key: string]: ComponentUpdateRequest;
  },
  parentEntityUpdate?: ParentEntityUpdateRequest
) {
  let state_transition_error: string = "Cannot update Entity when it is in CREATING state";
  console.log(`updating entity: ${entityId}`);
  while (entity_in_state_transition(state_transition_error)) {
    try {
      await aws().tm.updateEntity({
        workspaceId,
        entityId,
        entityName,
        description,
        componentUpdates,
        parentEntityUpdate
      });
      break; // fixed this bug from python version
    } catch (e) {
      state_transition_error = String(e);
      if (state_transition_error.indexOf("cannot be created as it already exists") > -1) {
        // pass
      } else if (entity_in_state_transition(state_transition_error)) {
        console.log(
          `waiting for entity ${entityId} to finish transition state before updating again: ${state_transition_error}`
        );
        await delay(10000);
      } else {
        throw e;
      }
    }
  }
  console.log(`updated entity: ${entityId}`);
}

export { importEntities, deleteEntities, updateEntity, EntityDefinition, deleteEntitiesWithServiceRecursion };
