import { Response } from '@/helpers/response'
import { parseBody } from '@/helpers/validation/body-parser'
import { extractSchemaError } from '@/helpers/validation/extract-schema-error'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'
import { SignInService } from './service'
import { cognitoClient } from '@/libs/cognito-client'
import {
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider'
import { InvalidCredentialsError } from '@/helpers/errors/invalid-credentials-error'

const signInSchema = z.object({
  email: z.string({ required_error: 'email is required' }).email(),
  password: z.string({ required_error: 'password is required' }).min(1),
})

export type SignInPayload = z.infer<typeof signInSchema>

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = parseBody(event.body)

    const validationRes = signInSchema.safeParse(body)
    if (!validationRes.success) {
      const err = extractSchemaError(validationRes.error.issues)
      return Response.badRequestErrorResponse(err)
    }

    const { data } = validationRes

    const { accessToken, refreshToken } = await new SignInService(
      cognitoClient,
    ).execute(data)

    return Response.okResponse('Signed up successfully', {
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.error(err)

    if (err instanceof UserNotFoundException) {
      return Response.unauthorizedError('Invalid credentials')
    }

    if (err instanceof NotAuthorizedException) {
      return Response.unauthorizedError('Invalid credentials')
    }

    if (err instanceof UserNotConfirmedException) {
      return Response.unauthorizedError(
        'You need confirm your account before signing in',
      )
    }

    if (err instanceof InvalidCredentialsError) {
      return Response.unauthorizedError(err.message)
    }

    return Response.internalServerError()
  }
}
