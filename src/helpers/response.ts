import { capitalize } from './format'

export class Response {
  static internalServerError() {
    return {
      statusCode: 500,
      body: { message: 'Internal server error' },
    }
  }

  static createdResponse(entity: string, body: unknown) {
    return {
      statusCode: 201,
      body: {
        message: `${capitalize(entity)} created successfully`,
        data: body,
      },
    }
  }

  static okResponse(message: string, body?: unknown) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
        data: body,
      }),
    }
  }

  static notFoundErrorResponse(entity: string) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `${capitalize(entity)} not found`,
      }),
    }
  }

  static badRequestErrorResponse(message: string) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message,
      }),
    }
  }
}
