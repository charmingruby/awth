import { Response } from '@/helpers/response'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider'
import { z } from 'zod'
import { parseBody } from '@/helpers/validation/body-parser'
import { cognitoClient } from '@/libs/cognito-client'
import { extractSchemaError } from '@/helpers/validation/extract-schema-error'
import { SignUpService } from './service'

const signUpSchema = z.object({
  email: z.string({ required_error: 'email is required' }).email(),
  password: z.string({ required_error: 'password is required' }).min(8),
  firstName: z.string({ required_error: 'firstName is required' }).min(1),
  lastName: z.string({ required_error: 'lastName is required' }).min(1),
})

export type SignUpPayload = z.infer<typeof signUpSchema>

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = parseBody(event.body)

    const validationRes = signUpSchema.safeParse(body)
    if (!validationRes.success) {
      const err = extractSchemaError(validationRes.error.issues)
      return Response.badRequestErrorResponse(err)
    }

    const { data } = validationRes

    const { id } = await new SignUpService(cognitoClient).execute(data)

    return Response.createdResponse('user', { id })
  } catch (err) {
    console.error('Sign Up Error:', err)

    if (err instanceof UsernameExistsException) {
      return Response.conflictErrorResponse('username')
    }

    return Response.internalServerError()
  }
}
