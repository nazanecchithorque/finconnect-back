import request from "supertest";
import { app } from "../app";
import { ClientType } from "../src/schemas/client.schema";
import TestAgent from "supertest/lib/agent";
import { beforeAll } from "vitest";

export let req: TestAgent;

// User Type -> Token
export const token: Partial<Record<ClientType, string>> = {};

// Before all test we login each type of user
beforeAll(async () => {
    req = request(app);

    const adminRes = await req
        .post("/clients/login")
        .send({ 
            email: "admin@gmail.com", 
            password: "admin123" 
        })
        .expect(200);

    token.admin = adminRes.body["token"];

    const endUserRes = await req
        .post("/clients/login").send({
            email: "free@gmail.com",
            password: "enduser123"
        })
        .expect(200);

    token.free = endUserRes.body["token"];

    const premiumRes = await req
        .post("/clients/login").send({
            email: "premium@gmail.com",
            password: "enduser123"
        })
        .expect(200);

    token.premium = premiumRes.body["token"];
});
