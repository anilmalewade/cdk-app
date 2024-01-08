import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';



// import { constants } from 'buffer';



interface DocumentManagementAPIProps {
    
 }

 export class DocumentManagementAPI extends Construct {
    constructor(scope: Construct, id: string, props?: DocumentManagementAPIProps) {
      super(scope, id);
      const getDocumentsFunction = new lambda.NodejsFunction(this, 'GetDocumentsFunction',{
        runtime: Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '..', 'api', 'getDocuments', 'index.ts'),
        handler: 'getDocuments',
        bundling: {
            // define: {},
            // minify: true,
            externalModules: ['aws-sdk']
        }
      });
    }
 }