import { z } from 'zod'

export const enumsEmployeeDesignationSchema = z.enum([
  'MANAGER',
  'DIVISION_HEAD',
  'HR_MANAGER',
  'FINANCE_MANAGER',
  'ENGINEER',
  'TECHNICIAN',
  'ASSISTANT_ENGINEER',
])