import { z } from 'zod'

export function extractSchemaError(issues: z.ZodIssue[]): string {
  return issues.map((e) => e.message).join(', ')
}
