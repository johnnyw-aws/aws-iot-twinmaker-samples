#!/usr/bin/env node

// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// eslint-disable-next-line chai-friendly/no-unused-expressions
yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir("commands")
  // Enable strict mode.
  .strict()
  // Useful aliases.
  .alias({ h: "help" }).argv;
