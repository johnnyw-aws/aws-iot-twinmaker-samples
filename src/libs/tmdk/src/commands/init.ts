/* eslint-disable no-var */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Arguments, CommandBuilder } from "yargs";

import {
  getDefaultAwsClients as aws,
  initDefaultAwsClients,
} from "../lib/aws-clients";
import * as fs from "fs";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import path from "path";
import {
  ListComponentTypesCommandOutput,
  ListScenesCommandOutput,
} from "@aws-sdk/client-iottwinmaker";

export type Options = {
  region: string | undefined;
  "workspace-id": string | undefined;
  out: string | undefined;
};

export const command = "init";
export const desc = "Initializes a tmdk application";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    region: {
      type: "string",
      require: false,
      description:
        "Specify the AWS region of the Workspace to bootstrap the project from.",
      defaultDescription: "$AWS_DEFAULT_REGION",
      default: process.env.AWS_DEFAULT_REGION,
    },
    "workspace-id": {
      type: "string",
      require: false,
      description:
        "Specify the ID of the Workspace to bootstrap the project from.",
      defaultDescription: "$WORKSPACE_ID",
      default: process.env.WORKSPACE_ID,
    },
    out: {
      type: "string",
      require: false,
      description: "Specify the directory to initialize a project in.",
    },
  });

// TODO better modeling for tmdk_config
async function import_component_types(
  workspaceIdStr: string,
  tmdk_config: any,
  outDir: string
) {
  if (!tmdk_config.hasOwnProperty("component-types")) {
    tmdk_config["component-types"] = [];
  }
  let nextToken: string | undefined = "";
  while (nextToken != undefined) {
    const resp: ListComponentTypesCommandOutput =
      await aws().tm.listComponentTypes({
        workspaceId: workspaceIdStr,
        nextToken: nextToken,
      });
    nextToken = resp["nextToken"];
    const componentTypeSummaries = resp["componentTypeSummaries"];
    if (componentTypeSummaries != undefined) {
      for (const componentTypeSummary of componentTypeSummaries) {
        if (!componentTypeSummary.arn?.includes("AmazonOwnedTypesWorkspace")) {
          console.log(
            `saving component type: ${componentTypeSummary.componentTypeId} ...`
          );

          const compResp = await aws().tm.getComponentType({
            workspaceId: workspaceIdStr,
            componentTypeId: componentTypeSummary.componentTypeId,
          });

          const componentDefinition = {
            // TODO more idiomatic
            componentTypeId: compResp["componentTypeId"],
            description: compResp["description"],
            extendsFrom: compResp["extendsFrom"],
            functions: compResp["functions"], // FIXME remove inherited values
            isSingleton: compResp["isSingleton"],
            propertyDefinitions: compResp["propertyDefinitions"],
            // 'tags': compResp['tags'] // FIXME type issue with tags?
          };

          // save to file
          fs.writeFileSync(
            `${outDir}/${compResp["componentTypeId"]}.json`,
            JSON.stringify(componentDefinition, null, 4)
          );

          tmdk_config["component-types"].push(
            `${compResp["componentTypeId"]}.json`
          ); // TODO idiomatic
        }
      }
    }
  }
  // save each non-pre-defined types into files
  fs.writeFileSync(`${outDir}/tmdk.json`, JSON.stringify(tmdk_config, null, 4));
  return tmdk_config;
}

// TODO better modeling for tmdk_config
async function import_scenes_and_models(
  workspaceIdStr: string,
  tmdk_config: any,
  outDir: string
) {
  let nextToken: string | undefined = "";
  while (nextToken != undefined) {
    const resp: ListScenesCommandOutput = await aws().tm.listScenes({
      workspaceId: workspaceIdStr,
      nextToken: nextToken,
    });
    nextToken = resp["nextToken"];
    const sceneSummaries = resp["sceneSummaries"];
    let contentBucket = ""; // FIXME should be from workspace not scene files
    if (sceneSummaries != undefined) {
      const streamToString = (stream: any) =>
        new Promise((resolve, reject) => {
          const chunks: any[] = [];
          stream.on("data", (chunk: any) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () =>
            resolve(Buffer.concat(chunks).toString("utf8"))
          );
        });

      const streamToBuffer = (stream: any) =>
        new Promise((resolve, reject) => {
          const chunks: any[] = [];
          stream.on("data", (chunk: any) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks)));
        });

      const modelFiles = new Set();
      for (const sceneSummary of sceneSummaries) {
        if (!tmdk_config.hasOwnProperty("scenes")) {
          tmdk_config["scenes"] = [];
        }
        if (!tmdk_config.hasOwnProperty("models")) {
          // TODO consider putting models under scenes to support selective import
          tmdk_config["models"] = [];
        }

        const s3ContentLocation = sceneSummary.contentLocation;
        if (s3ContentLocation != undefined) {
          contentBucket = s3ContentLocation.substring(5).split("/")[0];
          const contentKey = s3ContentLocation
            .substring(5)
            .split("/")
            .slice(1)
            .join("/");
          console.log(`saving scene file: ${contentKey}`);

          // from https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/src/s3_getobject.js
          const data = await aws().s3.send(
            new GetObjectCommand({ Bucket: contentBucket, Key: contentKey })
          );
          const bodyContents = await streamToString(data.Body);

          const sceneJson = JSON.parse(`${bodyContents}`);
          for (const n of sceneJson["nodes"]) {
            for (const c of n["components"]) {
              if (c["type"] == "ModelRef") {
                modelFiles.add(c["uri"]);

                if (c["uri"].startsWith("s3://")) {
                  // handle case where URI is like "s3://bucket/key.glb"
                  c["uri"] = c["uri"].split("/").slice(3).join("/"); // change to relative s3 uri path
                }
                if (path.extname(c["uri"]) == ".json") {
                  // Find URI of all models in JSON
                  // Obtain bucket name
                  let s3key = c["uri"] as string;

                  if (s3key.startsWith("s3://")) {
                    var s3bucket = s3key.split("/")[2];
                    s3key = s3key.split("/").slice(3).join("/");
                  } else {
                    var s3bucket = contentBucket;
                  }
                  // Obtain path of folder for JSON and download all files in that folder in the S3 bucket
                  const prefix = c["uri"].replace(path.basename(c["uri"]), "");
                  const objlist = await aws().s3.send(
                    new ListObjectsV2Command({
                      Bucket: s3bucket,
                      Prefix: prefix,
                    })
                  );
                  //console.log(objlist);
                  if (objlist.hasOwnProperty("Contents")) {
                    const contents = objlist["Contents"] as any[];
                    for (const [, value] of Object.entries(contents)) {
                      if (value.hasOwnProperty("Key")) {
                        modelFiles.add(`s3://${s3bucket}/${value["Key"]}`);
                      }
                    }
                  }
                }
              }
            }
          }

          // detect model files that absolute s3 path, update them to relative to support self-contained snapshot
          fs.writeFileSync(
            `${outDir}/${contentKey}`,
            JSON.stringify(sceneJson, null, 4)
          ); // TODO handle non-root scene files?
          (tmdk_config["scenes"] as string[]).push(`${contentKey}`); // TODO idiomatic
        }
      } // for each scene summary

      if (modelFiles.size > 0) {
        if (!fs.existsSync(`${outDir}/3d_models`)) {
          fs.mkdirSync(`${outDir}/3d_models`); // TODO idiomatic
        }
      }

      for (const value of modelFiles) {
        console.log(`saving model file: ${value} ...`);
        let s3key = value as string;

        if (s3key.startsWith("s3://")) {
          // handle case where URI is like "s3://bucket/key.glb"
          var s3bucket = s3key.split("/")[2];
          s3key = s3key.split("/").slice(3).join("/");
        } else {
          // handle case where URI is relative to workspace content root like "CookieFactoryEnvironment.glb"
          var s3bucket = contentBucket;
        }

        // FIXME - verify if need to handle the case where the scene file points to refs in other s3 buckets...should then modify the scene file during init?

        // handle case where s3 model file is in a sub-directory of the workspace bucket
        if (s3key.includes("/")) {
          const splitKey = s3key.split("/").slice(0, -1);
          console.log(`${s3key} -> ${splitKey}`);

          const dir_path = `${outDir}/3d_models`;
          for (let index = 0; index < splitKey.length; index++) {
            const subpath = `${splitKey.slice(0, index + 1).join("/")}`;
            if (!fs.existsSync(`${dir_path}/${subpath}`)) {
              console.log(`making path: ${dir_path}/${subpath} ...`);
              fs.mkdirSync(`${dir_path}/${subpath}`); // TODO idiomatic
            }
          }
        }

        const data = await aws().s3.send(
          new GetObjectCommand({ Bucket: s3bucket, Key: s3key })
        );
        const bodyContents = (await streamToBuffer(data.Body)) as Buffer;
        fs.writeFileSync(`${outDir}/3d_models/${s3key}`, bodyContents);
        (tmdk_config["models"] as string[]).push(`${s3key}`); // TODO idiomatic

        // handle binary data references in gltf files - https://www.khronos.org/files/gltf20-reference-guide.pdf
        if (s3key.endsWith(".gltf")) {
          const gltfData = JSON.parse(bodyContents.toString("utf8"));
          if (gltfData["buffers"]) {
            for (const buffer of gltfData["buffers"]) {
              if (!(buffer["uri"] as string).startsWith("data:")) {
                const binRelativePath = `${(value as string)
                  .split("/")
                  .slice(0, -1)
                  .join("/")}/${buffer["uri"]}`;

                console.log(
                  `  saving referenced bin file: ${binRelativePath} ...`
                );
                const binS3bucket = binRelativePath.split("/")[2];
                const binS3key = binRelativePath.split("/").slice(3).join("/");
                const binData = await aws().s3.send(
                  new GetObjectCommand({ Bucket: binS3bucket, Key: binS3key })
                );
                const binBodyContents = (await streamToBuffer(
                  binData.Body
                )) as Buffer;
                fs.writeFileSync(
                  `${outDir}/3d_models/${binS3key}`,
                  binBodyContents
                );
                (tmdk_config["models"] as string[]).push(`${binS3key}`); // TODO idiomatic
              }
            }
          }

          if (gltfData["images"]) {
            for (const image of gltfData["images"]) {
              if (!(image["uri"] as string).startsWith("data:")) {
                const binRelativePath = `${(value as string)
                  .split("/")
                  .slice(0, -1)
                  .join("/")}/${image["uri"]}`;

                console.log(
                  `saving referenced gltf bin file: ${binRelativePath} ...`
                );
                const binS3bucket = binRelativePath.split("/")[2];
                const binS3key = binRelativePath.split("/").slice(3).join("/");
                const binData = await aws().s3.send(
                  new GetObjectCommand({ Bucket: binS3bucket, Key: binS3key })
                );
                const binBodyContents = (await streamToBuffer(
                  binData.Body
                )) as Buffer;
                fs.writeFileSync(
                  `${outDir}/3d_models/${binS3key}`,
                  binBodyContents
                );
                (tmdk_config["models"] as string[]).push(`${binS3key}`); // TODO idiomatic
              }
            }
          }
        }
      }
      // save each non-pre-defined types into files
      fs.writeFileSync(
        `${outDir}/tmdk.json`,
        JSON.stringify(tmdk_config, null, 4)
      );
    }
  }
  return tmdk_config;
}

export const handler = async (argv: Arguments<Options>) => {
  const workspaceId = argv["workspace-id"] as string;
  const region = argv.region;
  const out = argv.out;
  const workspaceIdStr = workspaceId; //`${workspaceId}`; // TODO idiomatic
  console.log(
    `Bootstrapping project from workspace ${workspaceIdStr} in ${region} at project directory ${out}`
  );

  initDefaultAwsClients({ region: `${region}` }); // TODO idiomatic

  // create directory if not exists
  const outDir = `${out}`;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir); // TODO idiomatic
  }

  // create tmdk.json file
  let tmdk_config: any = {
    version: "0.0.2",
  };
  fs.writeFileSync(`${outDir}/tmdk.json`, JSON.stringify(tmdk_config, null, 4));

  // TODO revisit: import workspace bucket/role (probably need role for specialized permissions)

  // import component types
  console.log("====== Component Types ======");
  tmdk_config = await import_component_types(
    workspaceIdStr,
    tmdk_config,
    outDir
  );

  // import scenes
  console.log("====== Scenes / Models ======");
  tmdk_config = await import_scenes_and_models(
    workspaceIdStr,
    tmdk_config,
    outDir
  );

  // import entities
  console.log("========== Entities =========");
  const entities = [];
  let nextToken: string | undefined = "";
  let resp;
  let entityCount = 0;
  while (nextToken != undefined) {
    resp = await aws().tm.listEntities({
      workspaceId: workspaceIdStr,
      nextToken: nextToken,
    });
    nextToken = resp["nextToken"];
    const entitySummaries = resp["entitySummaries"];
    if (entitySummaries != undefined) {
      for (const entitySummary of entitySummaries) {
        entityCount += 1;
        console.log(
          `Saving entity (${entityCount} saved so far): ${entitySummary.entityId} ... `
        );
        const entityDetails = await aws().tm.getEntity({
          workspaceId: workspaceIdStr,
          entityId: entitySummary.entityId,
        });

        // TODO idiomatic
        const componentsDetails = entityDetails["components"] as object;
        let filteredComponentDetails;
        if (componentsDetails != undefined) {
          filteredComponentDetails = Object.entries(componentsDetails).reduce(
            (acc, [componentName, componentDetail]) => {
              const propertiesDetails = componentDetail["properties"] as object;

              // FIXME test case where property is added in component for entity but not in component type
              const filteredProperties = Object.entries(
                propertiesDetails
              ).reduce((prop_acc, [propName, propDetail]) => {
                if (
                  propDetail.hasOwnProperty("value") &&
                  propDetail["value"] != undefined
                ) {
                  prop_acc[propName] = {
                    definition: {
                      dataType: propDetail["definition"]["dataType"],
                    },
                    value: propDetail["value"],
                  };
                }

                return prop_acc;
              }, {} as { [key: string]: object });

              // process
              const filteredComponentDetail = {
                componentTypeId: componentDetail["componentTypeId"],
                properties: filteredProperties,
              };
              acc[componentName] = filteredComponentDetail;
              return acc;
            },
            {} as { [key: string]: object }
          );
        } else {
          filteredComponentDetails = [];
        }

        const entityDefinition = {
          // TODO more idiomatic
          components: filteredComponentDetails,
          description: entityDetails["description"],
          entityId: entityDetails["entityId"],
          entityName: entityDetails["entityName"], // FIXME remove inherited values
          parentEntityId: entityDetails["parentEntityId"],
          // 'tags': compResp['tags'] // FIXME type issue with tags?
        };

        entities.push(entityDefinition); // FIXME inherited values?
      }
    }
  }
  fs.writeFileSync(
    `${outDir}/entities.json`,
    JSON.stringify(entities, null, 4)
  ); // TODO handle entity file name collisions
  tmdk_config["entities"] = "entities.json";

  fs.writeFileSync(`${outDir}/tmdk.json`, JSON.stringify(tmdk_config, null, 4));

  console.log("== Finishing bootstrap ... ==");

  return 0;
};
