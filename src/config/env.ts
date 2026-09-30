import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),

  OPENAI_MODEL: z.string().default("gpt-5.6"),

  TRIPXL_API_BASE_URL: z.string().url(),

  TRIPXL_FLIGHT_SEARCH_PATH: z.string().default("/flight/v3/search"),

  TRIPXL_CALENDAR_FARE_PATH: z
    .string()
    .default("/flight/v1/calendar/fare/multiple"),

  DATABASE_URL: z.string().optional(),

  REDIS_URL: z.string().optional(),
  APP_TIMEZONE: z.string().default("Asia/Kolkata"),
 
  TRIPXL_API_TIMEOUT_MS:
  z.coerce
    .number()
    .int()
    .positive()
    .default(90000),
    
  TRIPXL_ACCESS_KEY:
    z.string().min(
      1,
      "TRIPXL_ACCESS_KEY is required"
    ),
    FRONTEND_URL:z.string().default("FRONTEND_URL")
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid environment variables:",
    result.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = result.data;
