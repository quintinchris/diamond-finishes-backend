export type LambdaHandler = {
  Type: string;
  Properties: {
    Description: string;
    FunctionName: string;
    Handler: string;
    Runtime: string;
  };
};