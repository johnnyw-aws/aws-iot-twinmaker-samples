// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  transform: {"^.+\\.ts?$": "ts-jest"},
  testEnvironment: "node",
  testRegex: "/e2e-tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  slowTestThreshold: 999999,
};
