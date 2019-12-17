import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { CreateItemRequest } from '../requests/CreateItemRequest'
import { UpdateItemRequest } from '../requests/UpdateItemRequest'
import { Item } from '../models/Item'

const XAWS = AWSXRay.captureAWS(AWS)

export class ItemAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly itemsTable: string = process.env.ITEMS_TABLE,
    private readonly itemsIndex: string = process.env.INDEX_NAME,
    
    private readonly s3: AWS.S3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName: string = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    ) {
  }

  async getAllItems(expression): Promise<Item[]> {

    const result = await this.docClient.query({
      TableName: this.itemsTable,
      IndexName: this.itemsIndex,
      ...expression,
      ScanIndexForward: false
    }).promise();

    return result.Items as Item[]
  }

  async getItem(expression): Promise<Item> {

    const result = await this.docClient.query({
      TableName: this.itemsTable,
      IndexName: this.itemsIndex,
      ...expression,
    }).promise()

    return result.Items[0] as Item
  }
  
  async createItem(createItemRequest: CreateItemRequest, userId: string): Promise<Item> {

    const itemId = createItemRequest.itemId
    const createdAt = new Date().toISOString()
    let attachmentUrl
    
    if ( createItemRequest.attachment ) {
      attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${itemId}`
    } 
    
    const newItem: any = {
      ...createItemRequest,
      userId,
      createdAt,
      attachmentUrl
    }
    
    await this.docClient.put({
      TableName: this.itemsTable,
      Item: newItem
    }).promise()
    
    return newItem
  }

  async deleteItem(key: object): Promise<void> {
  
    await this.docClient.delete({
      TableName: this.itemsTable,
      Key: key
    }).promise()
  }

  generateUploadUrl(itemId: string) {

    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: itemId,
      Expires: this.urlExpiration
    })
  }

  async updateItem(UpdateItemRequest: UpdateItemRequest, key: object, itemId: string) {

    const expression = this.createUpdateExpression(UpdateItemRequest, itemId)
    
    const updateParams = {
      TableName: this.itemsTable,
      IndexName: this.itemsIndex,
      Key: key,
      ...expression,
      ReturnValues: 'ALL_NEW'
    }

    return await this.docClient.update(updateParams).promise()
  }

  createUpdateExpression(UpdateItemRequest: UpdateItemRequest, itemId: string) {

    if (!UpdateItemRequest.attachmentUrl) {
      UpdateItemRequest.attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${itemId}?${Date.now()}`
    }

    let arr = Object.keys(UpdateItemRequest).filter( key => UpdateItemRequest[key]);
    let ExpressionAttributeValues = {};
    let nameobj = {};
    let UpdateExpression = 'SET #';
    let ExpressionAttributeNames = {};
    
    arr.map((key) => {ExpressionAttributeValues[`:${key}`]=UpdateItemRequest[key]});
    arr.map((key) => {
      UpdateExpression += `${key} = :${key}, `
    });
    UpdateExpression = UpdateExpression.slice(0, -2)
    arr.map((key) => {nameobj[`#${key}`]=UpdateItemRequest[key]});
    ExpressionAttributeNames = {
      [Object.keys(nameobj)[0]] : arr[0]
    }
    
    return {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    }
  }

}