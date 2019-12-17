import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateItemRequest } from '../../requests/UpdateItemRequest'
import { updateItem } from '../../businessLogic/items'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('EVENT.BODY', event.body)
  const eventBody = JSON.parse(event.body)
  const UpdateItemRequest: UpdateItemRequest = eventBody.updatedFields
  const key: any = eventBody.key

  const itemId: string = event.pathParameters.itemId

  const updatedItem = await updateItem(UpdateItemRequest, key, itemId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updatedItem
    })
  }
}