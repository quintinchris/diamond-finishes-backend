import { LambdaHandler } from "./lambda.types";
import * as path from "path";

export const getLambdasFromTemplate: (
  resources: Record<"Type" | "Properties", LambdaHandler>
) => { [p: string]: string } = (
  resources: Record<"Type" | "Properties", LambdaHandler>
) => {
  return Object.values(resources)
    .filter(({ Type }: LambdaHandler) => Type === "AWS::Lambda::Function")
    .filter(({ Properties }: LambdaHandler) =>
      Properties.Runtime.startsWith("nodejs")
    )
    .map(({ Properties: { Handler } }: LambdaHandler) => ({
      functionName: `${Handler.split(".")[0]}`,
      filename: `${Handler}`,
    }))
    .reduce(
      (resources, resource) =>
        Object.assign(resources, {
          [`${resource.functionName}`]: `./src/handlers/${resource.functionName}/${resource.filename}.ts`,
        }),
      {}
    );
};
