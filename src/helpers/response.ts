import { Formatter } from './formatter'

export class Response {
  static internalServerError(reason?: string) {
    const message = reason
      ? `'Internal server error': ${reason}`
      : 'Internal server error'

    return {
      statusCode: 500,
      body: JSON.stringify({ message }),
    }
  }

  static unauthorizedError(message?: string) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: message || 'Unauthorized' }),
    }
  }

  static createdResponse(entity: string, body: unknown) {
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `${Formatter.capitalize(entity)} created successfully`,
        data: body,
      }),
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

  static conflictErrorResponse(entity: string) {
    return {
      statusCode: 409,
      body: JSON.stringify({
        message: `${Formatter.capitalize(entity)} already exists`,
      }),
    }
  }

  static notFoundErrorResponse(entity: string) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `${Formatter.capitalize(entity)} not found`,
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
