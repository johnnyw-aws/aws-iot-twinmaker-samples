// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const twinMakerPermissionPolicySuffix = "PermissionPolicy";

export const twinMakerAssumeRolePolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: {
        Service: "iottwinmaker.amazonaws.com"
      },
      Action: "sts:AssumeRole"
    }
  ]
};

export const twinMakerPermissionPolicy = {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetBucket",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject",
        "s3:ListObjects",
        "s3:ListObjectsV2",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "s3ArnStar", // replaced with workspace bucket
        "s3ArnStandard" // replaced with workspace bucket
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:DeleteObject"
      ],
      "Resource": [
        "s3ArnDelete" // replaced with workspace bucket
      ]
    },
    {
      "Effect": "Allow",
      "Action": "lambda:InvokeFunction",
      "Resource": "arn:aws:lambda:*:*:function:iottwinmaker-*"
    },
    {
      "Effect": "Allow",
      "Action": "kinesisvideo:DescribeStream",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iotsitewise:DescribeAssetModel",
        "iotsitewise:ListAssetModels",
        "iotsitewise:DescribeAsset",
        "iotsitewise:ListAssets",
        "iotsitewise:DescribeAssetProperty",
        "iotsitewise:GetAssetPropertyValue",
        "iotsitewise:GetAssetPropertyValueHistory"
      ],
      "Resource": "*"
    }
  ]
}
