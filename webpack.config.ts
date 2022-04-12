import { readFileSync } from "fs";
import { yamlParse } from "yaml-cfn";
import { getLambdasFromTemplate } from "./src/utils/getLambdasFromTemplate";
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
import { webpack } from "webpack";
import * as path from "path";

const { Resources } = yamlParse(
  readFileSync(path.join(__dirname, "template.yml"), "utf-8")
);

const entries = getLambdasFromTemplate(Resources);

const config = {
  entry: entries,
  output: {
    library: {
      type: "commonjs2",
    },
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, "/src"),
        exclude: path.resolve(__dirname, "/node_modules/"),
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true
        }
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  mode: process.env.NODE_ENV === "dev" ? "development" : "production",
  plugins: [new ForkTsCheckerWebpackPlugin()]
};

module.exports = config;
