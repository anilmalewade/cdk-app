import * as cdk from 'aws-cdk-lib';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
// import * as cdk from 'aws-cdk-lib';
// import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
// import { Construct } from 'constructs';
import { Networking } from './networking';
import { DocumentManagementAPI } from './api';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import {Tags} from 'aws-cdk-lib'
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as path from 'path';

export class TypescriptCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'DocumentsBucket', {
      encryption: BucketEncryption.S3_MANAGED
    });

    new s3Deploy.BucketDeployment(this, 'BucketDeployment', {
      sources: [
        s3Deploy.Source.asset(path.join(__dirname, '..', 'documents'))
      ],
      destinationBucket: bucket,
      memoryLimit: 400
    })
     
    new cdk.CfnOutput(this,'DocumentsBucketNameExport', {
     value: bucket.bucketName,
     exportName: 'DocumentsBucketName'
    });

    const networkingStack = new Networking(this, 'NetworkingConstruct', {
      maxAzs: 2
    });

    Tags.of(networkingStack).add('Module', 'Networking');

    const api = new DocumentManagementAPI(this, 'DocumentManagementAPI', {
      documentBucket: bucket
    });

    Tags.of(api).add('Module', 'API');

    // The code that defines your stack goes here
    

    // example resource
    // const queue = new sqs.Queue(this, 'TypescriptCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
  
}
