import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/index";
import { env } from "././env";

export const db = drizzle(env.DATABASE_URL!, {
    schema,
    logger: env.DEBUG_QUERIES
});

async function testDBConnection() {
    try {
        await db.execute("select 1");
    } catch {
        console.error("Drizzle its not configured correctly");
        process.exit(1);
    }
}
testDBConnection();
