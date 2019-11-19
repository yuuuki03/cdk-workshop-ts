import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import dynamoDB = require('@aws-cdk/aws-dynamodb');

export interface HitCounterProps {
    downstream: lambda.Function;
}

export class Hitcounter extends cdk.Construct {
    public readonly HitCounter: lambda.Function;
    private readonly handler: lambda.Function;

    constructor(scope: cdk.Construct, id: string, props: HitCounterProps){
        super(scope, id);

        const table = new dynamoDB.Table(this, 'Hits', {
            partitionKey: {name: 'path', type: dynamoDB.AttributeType.STRING}
        });

        this.handler = new lambda.Function(this, 'HitCounterHandler', {
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'hitcounter.handler',
            code: new lambda.AssetCode('lambda'),
            functionName: 'HitCounter',
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName
            }
        })

        table.grantReadWriteData(this.handler);
        props.downstream.grantInvoke(this.handler);
    }
}