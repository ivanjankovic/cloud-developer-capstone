import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { Item } from '../../models/Item'
import { getUserId } from '../utils'
import { getItem } from '../../businessLogic/items'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const userId: string = getUserId(event)
  const itemId: string = event.pathParameters.itemId
  const item: Item = await getItem(userId, itemId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}