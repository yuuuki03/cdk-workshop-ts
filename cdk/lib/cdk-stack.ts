import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import { Hitcounter } from "./hitcounter";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda
    const hello = new lambda.Function(this, 'HelloHandler', {
      functionName: 'HelloHandler',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: new lambda.AssetCode('lambda'),
      handler: 'hello.handler'
    });

    const helloWithCounter = new Hitcounter(this, 'HelloHitCounter', {downstream: hello});

    // apigw
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello
    })

  }
}
