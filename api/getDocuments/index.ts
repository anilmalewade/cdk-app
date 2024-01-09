import {APIGatewayProxyEventV2, Context, APIGatewayProxyStructuredResultV2} from "aws-lambda"
import S3 from 'aws-sdk/clients/s3'
import { constants } from "buffer";
import { promises } from "dns";
// const AWS = require('aws-sdk');   
// const s3 = new AWS.S3();
const s3 = new S3();
const bucketName = process.env.DOCUMNENT_BUCKET_NAME
export const getDocuments = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> =>{
  console.log(`BucketName: ${bucketName}`)
  try {
      const {Contents: results } = await s3.listObjects({Bucket: process.env.DOCUMNENT_BUCKET_NAME!}).promise();
      const documents = await Promise.all(results!.map(async r => genrateSignedURL(r)))
      return {
          statusCode: 200,
          body: JSON.stringify(documents)
      }
  } catch (err) {
      return {
          statusCode: 500,
          body: err.rmessage
      }
  }
}

const genrateSignedURL = async (object: S3.Object): Promise<{ filename: string, url:string}>=>{
  const url = await s3.getSignedUrlPromise('getObject',{
    Bucket: bucketName,
    key: object.Key!,
    Expires: (60*60)// one hour
  })
  return {
    filename:object.Key!,
    url:url
  }
}
