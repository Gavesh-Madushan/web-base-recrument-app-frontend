import { z } from 'zod'

export const fetchUploadPathParamsSchema = z.object({
  staticPath: z.string(),
})

/**
 * @description The request has succeeded.
 */
export const fetchUpload200Schema = z.string()

/**
 * @description The server cannot find the requested resource.
 */
export const fetchUpload404Schema = z.object({
  message: z.string(),
})

export const fetchUploadQueryResponseSchema = z.lazy(() => fetchUpload200Schema)