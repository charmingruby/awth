import { z } from 'zod'

export function validateSchema(
  success: boolean,
  issues: z.ZodIssue[],
): string | null {
  if (!success) {
    return issues.map((e) => e.message).join(', ')
  }

  return null
}
