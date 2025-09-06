import { z } from 'zod'

export const scalarsDaySchema = z.coerce.number().int().min(1).max(31)