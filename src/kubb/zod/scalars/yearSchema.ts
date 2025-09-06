import { z } from 'zod'

export const scalarsYearSchema = z.coerce.number().int().min(2000).max(9999)