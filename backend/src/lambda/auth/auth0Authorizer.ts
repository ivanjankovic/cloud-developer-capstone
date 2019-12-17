import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'

import Axios from 'axios'
import { verify, decode } from 'jsonwebtoken'
import { certToPEM } from '../../auth/utils'

import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const jwksUrl = 'https://dev-bmsduv85.auth0.com/.well-known/jwks.json'

export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

  try {

    const authHeader: string = event.authorizationToken
    const jwtToken = await verifyToken(authHeader)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (error) {
    console.log('User was not authorized', error.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {

  const token = getToken(authHeader)
  const auth0Certificate = await getAuth0Certificate(token)

  return verify(
    token,
    auth0Certificate,
    { algorithms: ['RS256'] }
  ) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function getAuth0Certificate(token: string): Promise<string> {

  // Retrieve the JWKS
  const signingKeys = await getSigningKeys(jwksUrl)

  // Decode the JWT and grab the kid property from the header.
  const decodedToken: Jwt = decode(token, { complete: true }) as Jwt

  // Find the signing key in the filtered JWKS with a matching kid property.
  const signingKey = getSigningKey(decodedToken.header.kid, signingKeys)

  // Using the x5c property build a certificate 
  const auth0Certificate = certToPEM(signingKey.x5c[0])

  return auth0Certificate
}

async function getSigningKeys(jwksUrl: string) {
  const response = await Axios.get(jwksUrl)
  return response.data.keys
}

function getSigningKey(kid: string, keys) {
  return keys.find(key => key.kid === kid)
}