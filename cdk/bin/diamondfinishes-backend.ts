#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as aws_apigateway from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
export class DiamondfinishesBackendStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const sendEmailHandler = new lambda.Function(this, "sendEmailHandler", {
      code: lambda.Code.fromAsset(join(__dirname, "../../handlers/sendEmail")),
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: "sendEmailHandler",
      description: "handles sending emails to user",
      handler: "../handlers/sample.handler.ts",
    });

    new aws_apigateway.LambdaRestApi(this, "DiamondFinishesAPI", {
      description: "API Gateway for Diamond Finishes",
      restApiName: "Diamond Finishes API",
      handler: sendEmailHandler,
      cloudWatchRole: true
    });
  }
}

const app = new cdk.App();
new DiamondfinishesBackendStack(app, 'DiamondfinishesBackendStack');