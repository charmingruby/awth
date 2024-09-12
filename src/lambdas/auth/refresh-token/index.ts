import { Response } from '@/helpers/response'
import { parseBody } from '@/helpers/validation/body-parser'
import { extractSchemaError } from '@/helpers/validation/extract-schema-error'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'
import { RefreshTokenService } from './service'
import { cognitoClient } from '@/libs/cognito-client'
import {
  NotAuthorizedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider'

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

export type RefreshTokenPayload = z.infer<typeof refreshTokenSchema>

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = parseBody(event.body)

    const validationRes = refreshTokenSchema.safeParse(body)
    if (!validationRes.success) {
      const err = extractSchemaError(validationRes.error.issues)
      return Response.badRequestErrorResponse(err)
    }

    const { data } = validationRes

    const { accessToken, refreshToken } = await new RefreshTokenService(
      cognitoClient,
    ).execute(data)

    return Response.okResponse('Signed up successfully', {
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.error(err)

    if (err instanceof UserNotFoundException) {
      return Response.unauthorizedError()
    }

    if (err instanceof NotAuthorizedException) {
      return Response.unauthorizedError()
    }

    return Response.internalServerError()
  }
}
