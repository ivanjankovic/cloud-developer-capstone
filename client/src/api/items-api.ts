import { apiEndpoint } from '../config'
import { typeItem } from '../types/Item';
import { CreateItemRequest } from '../types/CreateItemRequest';
import { UpdateItemRequest } from '../types/UpdateItemRequest';
import Axios from 'axios'

export async function getItems(idToken: string): Promise<typeItem[]> {
  console.log('GETTING Items')
  
  const response = await Axios.get(`${apiEndpoint}/items`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })

  console.log('GOT Items:', response.data.items)
  return response.data.items
}

export async function getItem(idToken: string, itemId: string): Promise<typeItem> {
  console.log('GETTING Item')

  const response = await Axios.get(`${apiEndpoint}/items/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('GOT Item:', response.data.item)
  return response.data.item
}

export async function createItem(
  idToken: string,
  newItemRequest: CreateItemRequest
): Promise<typeItem> {
  console.log('NEW Item Request: ', newItemRequest)
  const response = await Axios.post(`${apiEndpoint}/items`,  JSON.stringify(newItemRequest), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('NEW Item Created: ', response.data.item)
  return response.data.item
}

export async function patchItem(
  idToken: string,
  itemId: string,
  updatedFields: UpdateItemRequest,
  key: any
): Promise<void> {
  console.log('Item UPDATED Request: ', updatedFields, key)
  const response = await Axios.patch(`${apiEndpoint}/items/${itemId}`, JSON.stringify({updatedFields, key}), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  return response.data.updatedItem.Attributes
}

export async function deleteTodo(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteItem(
  idToken: string,
  itemId: string
): Promise<void> {
  console.log('DELLITING Item:', {itemId})
  await Axios.delete(`${apiEndpoint}/items/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  itemId: string
): Promise<string> {
  console.log('GETTING upload Url:', {'idToken': idToken, 'itemId': itemId})
  const response = await Axios.post(`${apiEndpoint}/items/${itemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  console.log('UPLOADING file to:', {uploadUrl})
  await Axios.put(uploadUrl, file)
}
