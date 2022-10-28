// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IAM } from "@aws-sdk/client-iam";
import { STS } from "@aws-sdk/client-sts";
import { IoTTwinMaker } from "@aws-sdk/client-iottwinmaker";
import { S3 } from "@aws-sdk/client-s3";
import { CloudFormation } from "@aws-sdk/client-cloudformation";
import { KinesisVideo } from "@aws-sdk/client-kinesis-video";

// TODO cleanup pass
class AwsClients {
  region: string;

  sts: STS;
  tm: IoTTwinMaker;
  iam: IAM;
  s3: S3;
  cf: CloudFormation;
  kvs: KinesisVideo;

  constructor(region: string) {
    this.region = region;
    const options = { customUserAgent: 'tmdk/0.0.2', region: region };
    this.sts = new STS(options);
    this.tm = new IoTTwinMaker(options);
    this.iam = new IAM(options);
    this.s3 = new S3(options);
    this.cf = new CloudFormation(options);
    this.kvs = new KinesisVideo(options);
  }

  async getCurrentIdentity() {
    const identity = await this.sts.getCallerIdentity({});
    if (!identity.Account || !identity.Arn) {
      throw new Error("Invalid identity in the sts getCallerIdentity response");
    }
    return { accountId: identity.Account, accountArn: identity.Arn };
  }
}

let defaultAwsClients: AwsClients | null = null;

function initDefaultAwsClients(options: { region: string }) {
  defaultAwsClients = new AwsClients(options.region);
}

function getDefaultAwsClients() {
  if (!defaultAwsClients) {
    throw new Error(
      "initDefaultAwsClients must be called before calling getDefaultAwsClients"
    );
  }
  return defaultAwsClients;
}

export { initDefaultAwsClients, getDefaultAwsClients, AwsClients };
