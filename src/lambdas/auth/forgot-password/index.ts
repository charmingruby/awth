import { Response } from '@/helpers/response'
import { parseBody } from '@/helpers/validation/body-parser'
import { extractSchemaError } from '@/helpers/validation/extract-schema-error'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'
import { cognitoClient } from '@/libs/cognito-client'
import {
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider'
import { ForgotPasswordService } from './service'

const forgotPasswordSchema = z.object({
  email: z.string({ required_error: 'email is required' }).email(),
})

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = parseBody(event.body)

    const validationRes = forgotPasswordSchema.safeParse(body)
    if (!validationRes.success) {
      const err = extractSchemaError(validationRes.error.issues)
      return Response.badRequestErrorResponse(err)
    }

    const { data } = validationRes

    await new ForgotPasswordService(cognitoClient).execute(data)

    return Response.okResponse('Email verification sent')
  } catch (err) {
    console.error(err)

    if (err instanceof UserNotFoundException) {
      return Response.unauthorizedError()
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
