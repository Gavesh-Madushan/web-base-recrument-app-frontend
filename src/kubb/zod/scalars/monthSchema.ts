import { z } from 'zod'

export const scalarsMonthSchema = z.coerce.number().int().min(0).max(11)