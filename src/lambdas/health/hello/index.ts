import { Response } from '@/helpers/response'
import { APIGatewayProxyEventV2 } from 'aws-lambda'

export async function handler(_event: APIGatewayProxyEventV2) {
  return Response.okResponse('Endpoint hit', { ping: true })
}
