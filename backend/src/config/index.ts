import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  RPC_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CACHE_TTL: z.coerce.number().int().positive().default(300),
  MAX_STORAGE_SLOTS: z.coerce.number().int().positive().default(500),
  BATCH_SIZE: z.coerce.number().int().positive().default(50),
  ROOTSTOCK_EXPLORER_API: z.string().url().optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type Config = z.infer<typeof envSchema>;

let config: Config | null = null;

export function getConfig(): Config {
  if (!config) {
    config = envSchema.parse(process.env);
  }
  return config;
}

export const appConfig = getConfig();

