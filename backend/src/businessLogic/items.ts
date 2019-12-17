import { CreateItemRequest } from '../requests/CreateItemRequest'
import { UpdateItemRequest } from '../requests/UpdateItemRequest'
import { Item } from '../models/Item'

import { ItemAccess } from '../dataLayer/itemAccess'

const itemAccess = new ItemAccess()

export async function getAllItems(userId: string): Promise<Item[]> {
  
  const expression = {
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }
  
  return itemAccess.getAllItems(expression)
}

export async function getItem(userId: string, itemId: string): Promise<Item> {
  
  const expression = {
    KeyConditionExpression: 'userId = :userId and itemId = :itemId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':itemId': itemId
    }
  }
  
  return itemAccess.getItem(expression)
}

export async function getKey(itemId: string, userId: string): Promise<object> {
  
  const item = await getItem(userId, itemId)
  const createdAt = item.createdAt
  
  return { userId, createdAt }
}

export async function createItem(
  createItemRequest: CreateItemRequest,
  userId: string
  ): Promise<Item> {

  return itemAccess.createItem(createItemRequest, userId)
}

export async function deleteItem(itemId: string, userId: string) {

  const key = await getKey(itemId, userId)
  itemAccess.deleteItem(key)
}

export async function updateItem(UpdateItemRequest: UpdateItemRequest, key: any, itemId: string) {

  return itemAccess.updateItem(UpdateItemRequest, key, itemId)
}

export async function generateUploadUrl(itemId: string) {
  
  return itemAccess.generateUploadUrl(itemId)
}