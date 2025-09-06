import { z } from 'zod'

/**
 * @description A tuple denoted as [lat, long]
 */
export const locationItemSchema = z.array(z.coerce.number()).min(2).max(2).describe('A tuple denoted as [lat, long]')