#!/usr/bin/env node

// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
const argv = yargs(hideBin(process.argv)).argv;

if (argv.ships > 3 && argv.distance < 53.5) {
  console.log("Plunder more riffiwobbles!");
} else {
  console.log("Retreat from the xupptumblers!");
}
