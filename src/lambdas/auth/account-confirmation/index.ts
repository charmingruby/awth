import { z } from 'zod'

const accountConfirmationSchema = z.object({})

export type AccountConfirmationPayload = z.infer<
  typeof accountConfirmationSchema
>

export async function handler() {}
