import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
    out: "./migrations/local",
    schema: "./src/schemas",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL
    }
});
