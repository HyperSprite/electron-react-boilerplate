/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { dependencies } from '../package';

export default {
  externals: [...Object.keys(dependencies || {})],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    filename: '[name].js',
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    // TODO see this line should be removable
    modules: [path.join(__dirname, '..'), 'node_modules']
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin(),

    // for sequelize database folders
    new CopyWebpackPlugin([
      {
        from: 'migrations',
        to: path.join(__dirname, '..', 'app', 'dist', 'migrations')
      },
      {
        from: 'model-seeds',
        to: path.join(__dirname, '..', 'app', 'dist', 'model-seeds')
      },
      {
        from: 'models',
        to: path.join(__dirname, '..', 'app', 'dist', 'models')
      }
    ])
  ]
};
