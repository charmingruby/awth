import { Response } from '@/helpers/response'
import { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { ProfileService } from './service'
import { cognitoClient } from '@/libs/cognito-client'

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub as string

    const { user } = await new ProfileService(cognitoClient).execute(userId)

    return Response.okResponse('Profile found successfully', { user })
  } catch (err) {
    console.error(err)

    return Response.internalServerError()
  }
}
