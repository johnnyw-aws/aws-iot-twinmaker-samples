/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

let exec = require("child_process").exec;
let os = require("os");

function puts(_error, stdout, _stderr) {
  console.log(stdout);
}

// Run command depending on the OS
console.log("OS detected: " + os.type());

if (os.type() === "Linux") {
  exec("npm run package-linux", puts);
} else if (os.type() === "Darwin") {
  exec("npm run package-mac", puts);
  // } else if (os.type() === 'Windows_NT') {
  //     exec("node build-windows.js", puts);
} else {
  throw new Error("Unsupported OS found: " + os.type());
}
