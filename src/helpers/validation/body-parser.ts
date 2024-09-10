export function parseBody(json: string) {
  let body: unknown

  try {
    body = JSON.parse(json)
    return body
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid JSON format',
      }),
    }
  }
}
