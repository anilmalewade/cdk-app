import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam'



// import { constants } from 'buffer';



interface DocumentManagementAPIProps {
    documentBucket: s3.IBucket
 }

 export class DocumentManagementAPI extends Construct {
    constructor(scope: Construct, id: string, props: DocumentManagementAPIProps) {
      super(scope, id);
      const getDocumentsFunction = new lambda.NodejsFunction(this, 'GetDocumentsFunction',{
        runtime: Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '..', 'api', 'getDocuments', 'index.ts'),
        handler: 'getDocuments',
        // externals: ""
        bundling: {
            // define: {},
            // minify: true,
            externalModules: ['aws-sdk/*']
        },
        environment: {
          DOCUMNENT_BUCKET_NAME: props.documentBucket.bucketName
        }
      });
      const bucketPermissions = new iam.PolicyStatement();
      bucketPermissions.addResources(`${props.documentBucket.bucketArn}/*`)
      bucketPermissions.addActions('s3:GetObject', 's3:PutObject')
      getDocumentsFunction.addToRolePolicy(bucketPermissions)
      const bucketContainerPermissions = new iam.PolicyStatement();
      bucketContainerPermissions.addResources(props.documentBucket.bucketArn)
      bucketContainerPermissions.addActions('s3:ListBucket')
      getDocumentsFunction.addToRolePolicy(bucketContainerPermissions)

    }
 }