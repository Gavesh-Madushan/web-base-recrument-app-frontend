import { z } from 'zod'

/**
 * @description Must be specified in cents
 */
export const scalarsMoneySchema = z.coerce.number().int().min(0).max(9999999900).describe('Must be specified in cents')