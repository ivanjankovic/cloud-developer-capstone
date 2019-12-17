import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateItemRequest } from '../../requests/CreateItemRequest'
import { Item } from '../../models/Item'

import { createItem } from '../../businessLogic/items'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const createItemRequest: CreateItemRequest = JSON.parse(event.body)
  const userId: string = getUserId(event)
  const item: Item = await createItem(createItemRequest, userId)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item })
  }
}