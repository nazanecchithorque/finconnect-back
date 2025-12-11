// types/express.d.ts
import { TokenData } from "../src/schemas/client.schema";

declare global {
    namespace Express {
        interface Locals {
            client: TokenData;
        }
    }
}
export {};
