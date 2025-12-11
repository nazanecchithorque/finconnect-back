import "dotenv/config"; // Importante cargar el .env
import { z } from "zod";
import { strToBoolean, strToNumberDefault } from "./validators/util";
import { Secret } from "jsonwebtoken";

const logLevels = {
    emerg: "emerg",
    alert: "alert",
    crit: "crit",
    error: "error",
    warning: "warning",
    notice: "notice",
    info: "info",
    debug: "debug"
} as const;

type LogLevels = keyof typeof logLevels;
const logLevelsNames = Object.keys(logLevels) as [LogLevels];

const baseSchema = z.object({
    NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
    LOG_LEVEL: z.enum(logLevelsNames).default(logLevels.info),
    DEBUG_QUERIES: strToBoolean().default(false),

    HOST: z.string().default("localhost"),
    DB_HOST: z.string().default("localhost"),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DB_PORT: strToNumberDefault("5432"),

    PORT: strToNumberDefault("3000"),

    // JWT
    JWT_SECRET: z.string().transform((e) => e as Secret),
    JWT_EXPIRES_IN: z.string().default("1000h")
});

const prodSchema = baseSchema.transform((env) => ({
    ...env,
    DATABASE_URL: `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`
}));

const testEnvSchema = baseSchema
    .extend({
        JWT_SECRET: z.string().or(z.undefined())
    })
    .transform((env) => ({
        ...env,
        DATABASE_URL: `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
        JWT_SECRET: "supersecretkey"
    }));

export const env =
    process.env.NODE_ENV === "test"
        ? testEnvSchema.parse(process.env)
        : prodSchema.parse(process.env);
