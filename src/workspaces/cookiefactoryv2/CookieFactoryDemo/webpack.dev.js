// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';

import common from './webpack.common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: 'development',

  devServer: {
    hot: true,
    port: 9000,
    static: './public/'
  },

  devtool: 'inline-source-map',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '/dev/')
  }
});
