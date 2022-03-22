import { readFileSync } from "fs";
import { yamlParse } from "yaml-cfn";
import { getLambdasFromTemplate } from "./src/utils/getLambdasFromTemplate";
import { webpack } from "webpack";
import * as path from "path";

const { Resources } = yamlParse(
  readFileSync(path.join(__dirname, "template.yml"), "utf-8")
);

const entries = getLambdasFromTemplate(Resources);

const config = {
  entry: entries,
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        include: path.resolve(__dirname, "/src/handlers"),
        exclude: ["/node_modules/", "/src/samBundler/", "/src/cdk" ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
};

module.exports = config;
