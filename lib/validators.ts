import { z } from 'zod'

export const HomeDataSchema = z.object({
  hero: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    description: z.string().min(1),
    animationStyle: z.enum(['typewriter', 'fadeIn', 'slideUp']),
  }),
  meta: z.object({
    pageTitle: z.string().min(1),
    description: z.string().min(1),
  }),
})

export const AppConfigSchema = z.object({
  appName: z.string().min(1),
  version: z.string().min(1),
  locale: z.string().min(1),
  theme: z.enum(['light', 'dark']),
})

export type HomeDataZod = z.infer<typeof HomeDataSchema>
export type AppConfigZod = z.infer<typeof AppConfigSchema>
