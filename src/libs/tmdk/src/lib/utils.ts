// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { randomBytes } from "crypto";
import { spawnSync, SpawnSyncOptions } from "child_process";
import { getDefaultAwsClients as aws } from "./aws-clients";

class RetryExhaustedError extends Error {
  lastError: any;

  constructor(lastError: any, message?: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RetryExhaustedError);
    }

    this.name = "RetryExhaustedError";
    this.lastError = lastError;
  }
}

class UnretryableError extends Error {
  lastError: any;

  constructor(lastError: any, message?: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RetryExhaustedError);
    }

    this.name = "UnretryableError";
    this.lastError = lastError;
  }
}

async function delay(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function retryAsync<T>(
  func: () => Promise<T>,
  options?: {
    attempts?: number;
    shouldRetry?: (e?: unknown) => boolean;
    beforeRetry?: () => Promise<void>;
  }
) {
  let shouldRetry = options?.shouldRetry || (() => true);
  let beforeRetry = options?.beforeRetry;

  let remainingAttempts = options?.attempts ?? 3;
  let lastError: any = undefined;

  while (remainingAttempts > 0) {
    try {
      return await func();
    } catch (err) {
      lastError = err;

      if (shouldRetry(err)) {
        remainingAttempts--;
        beforeRetry && (await beforeRetry());
      } else {
        throw new UnretryableError(
          lastError,
          "The last error was not retryable"
        );
      }
    }
  }
  throw new RetryExhaustedError(lastError, "Retry exhausted");
}

function createUniqueId() {
  const uniqueId = randomBytes(4).toString("hex");
  return uniqueId;
}

function replaceTemplateVars(template: string, dict: Record<string, string>) {
  let result = template;
  for (const key in dict) {
    if (Object.prototype.hasOwnProperty.call(dict, key)) {
      const value = dict[key];
      const regex = new RegExp("{" + key + "}", "g");
      result = result.replace(regex, value);
    }
  }
  return result;
}

async function getCfnStackOutputValue(stackName: string, outputKey: string) {
  let cfnStackOutputValue: string | undefined;
  try {
    const cfStack = await aws().cf.describeStacks({
      StackName: stackName,
    });
    cfnStackOutputValue = cfStack.Stacks?.[0].Outputs?.find(
      (o) => o.OutputKey === outputKey
    )?.OutputValue;
  } catch (e) {
    throw new Error(
      `Unable to describe the CloudFormation stack provided.
      ${e}`
    );
  }

  if (!cfnStackOutputValue) {
    throw new Error("Unable to find the required output value from the stack.");
  }

  return cfnStackOutputValue;
}

// copied from: https://github.com/aws/aws-cdk/blob/v2.23.0/packages/%40aws-cdk/core/lib/bundling.ts
function dockerExec(args: string[], options?: SpawnSyncOptions) {
  const prog = process.env.CDK_DOCKER ?? "docker";
  const proc = spawnSync(
    prog,
    args,
    options ?? {
      stdio: [
        // show Docker output
        "ignore", // ignore stdio
        process.stderr, // redirect stdout to stderr
        "inherit", // inherit stderr
      ],
    }
  );

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status !== 0) {
    if (proc.stdout || proc.stderr) {
      throw new Error(
        `[Status ${proc.status}] stdout: ${proc.stdout
          ?.toString()
          .trim()}\n\n\nstderr: ${proc.stderr?.toString().trim()}`
      );
    }
    throw new Error(`${prog} exited with status ${proc.status}`);
  }

  return proc;
}

export {
  delay,
  retryAsync,
  createUniqueId,
  getCfnStackOutputValue,
  replaceTemplateVars,
  dockerExec,
  RetryExhaustedError,
  UnretryableError,
};
