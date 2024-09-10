import { Response } from '@/helpers/response'
import { parseBody } from '@/helpers/validation/body-parser'
import { extractSchemaError } from '@/helpers/validation/extract-schema-error'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'
import { AccountConfirmationService } from './service'
import { cognitoClient } from '@/libs/cognito-client'
import {
  CodeMismatchException,
  ExpiredCodeException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider'

const accountConfirmationSchema = z.object({
  email: z.string().email(),
  code: z.string().min(1),
})

export type AccountConfirmationPayload = z.infer<
  typeof accountConfirmationSchema
>

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = parseBody(event.body)

    const validationRes = accountConfirmationSchema.safeParse(body)
    if (!validationRes.success) {
      const err = extractSchemaError(validationRes.error.issues)
      return Response.badRequestErrorResponse(err)
    }

    const { data } = validationRes

    await new AccountConfirmationService(cognitoClient).execute(data)

    return Response.okResponse('Account confirmed successfully')
  } catch (err) {
    console.error(err)

    if (err instanceof UserNotFoundException) {
      return Response.badRequestErrorResponse('Account not found')
    }

    if (err instanceof CodeMismatchException) {
      return Response.badRequestErrorResponse('Invalid confirmation code')
    }

    if (err instanceof ExpiredCodeException) {
      return Response.badRequestErrorResponse('Expired confirmation code')
    }

    return Response.internalServerError()
  }
}
