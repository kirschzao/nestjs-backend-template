import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string().min(2),
  DATABASE_URL: z.string().url().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRATION: z.string().min(1),
  CLOUDFRONT_KEY_PAIR_ID: z.string().min(1),
  CLOUDFRONT_PRIVATE_KEY: z.string().min(1),
  CLOUDFRONT_COOKIE_BASE_DOMAIN: z.string().min(1),
  CLOUDFRONT_ASSET_DOMAIN: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_EXPIRATION: z.string().min(1),
  BUCKET_ACCESS_KEY_ID: z.string().min(1),
  BUCKET_SECRET_ACCESS_KEY: z.string().min(1),
  BUCKET_REGION: z.string().min(1),
  BUCKET_NAME: z.string().min(1),
  SES_ACCESS_KEY_ID: z.string().min(1),
  SES_SECRET_ACCESS_KEY: z.string().min(1),
  SES_REGION: z.string().min(1),
  SES_SENDER_EMAIL: z.string().min(1),
  SES_SENDER_NAME: z.string().min(1),
  CORS: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
