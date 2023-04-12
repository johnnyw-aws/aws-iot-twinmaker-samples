import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|hdr)$/i,
        use: [{ loader: 'file-loader' }]
      },
      {
        test: /\.(ts|js)x?$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                'formatjs',
                {
                  idInterpolationPattern: '[sha512:contenthash:base64:6]',
                  ast: true
                }
              ]
            ],
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ]
          }
        },
        exclude: {
          and: [/node_modules/],
          not: [/scene-composer\/dist\/src/]
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: { auto: true } }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devServer: {
    static: './public/',
    hot: true,
    port: 9000
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src/') },
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist/')
  },
  optimization: {
    runtimeChunk: 'single'
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new MiniCssExtractPlugin({ filename: '[name].css', chunkFilename: '[name].css' })
  ]
};
