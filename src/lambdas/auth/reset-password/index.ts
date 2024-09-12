import { Response } from '@/helpers/response'
import { parseBody } from '@/helpers/validation/body-parser'
import { extractSchemaError } from '@/helpers/validation/extract-schema-error'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'
import { cognitoClient } from '@/libs/cognito-client'
import {
  ExpiredCodeException,
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider'
import { ResetPasswordService } from './service'

const resetPasswordSchema = z.object({
  code: z.string({ required_error: 'code is required' }).min(1),
  email: z.string({ required_error: 'email is required' }).email(),
  newPassword: z.string({ required_error: 'newPassword is required' }).min(1),
})

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = parseBody(event.body)

    const validationRes = resetPasswordSchema.safeParse(body)
    if (!validationRes.success) {
      const err = extractSchemaError(validationRes.error.issues)
      return Response.badRequestErrorResponse(err)
    }

    const { data } = validationRes

    const { accessToken, refreshToken } = await new ResetPasswordService(
      cognitoClient,
    ).execute(data)

    return Response.okResponse('Password reset successfully', {
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.error(err)

    if (err instanceof UserNotFoundException) {
      return Response.unauthorizedError('Invalid credentials')
    }

    if (err instanceof ExpiredCodeException) {
      return Response.badRequestErrorResponse('Code expired')
    }

    if (err instanceof NotAuthorizedException) {
      return Response.unauthorizedError()
    }

    if (err instanceof UserNotConfirmedException) {
      return Response.unauthorizedError()
    }

    return Response.internalServerError()
  }
}
