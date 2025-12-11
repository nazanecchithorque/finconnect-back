import { describe, expect, it } from "vitest";
import { req, token } from "./setup";
import { clients } from "../seeders/client.seeder";

describe("User Controller (Integration)", () => {
    it("login - success", async () => {
        const loginData = {
            email: "admin@gmail.com",
            password: "admin123"
        };

        const res = await req
            .post("/clients/login")
            .send(loginData)
            .expect(200);

        const expRes = {
            success: true,
            message: "Logged successfully",
            role: "admin"
        };

        expect(res.body).toMatchObject(expRes);
    });

    it("login - missing fields", async () => {
        const loginData = {
            email: "admin@gmail.com",
        };

        const res = await req
            .post("/clients/login")
            .send(loginData)
            .expect(400);

        const expRes = {
            // success: false,
            message: 'Validation failed',
            errors: expect.any(Array)
        };

        expect(res.body).toMatchObject(expRes);
    });

    it("login - wrong password", async () => {
        const loginData = {
            email: "admin@gmail.com",
            password: "admin321"
        };

        const res = await req
            .post("/clients/login")
            .send(loginData)
            .expect(401);

        const expRes = {
            // success: false,
            message: "Wrong password",
            // errors: expect.any(Array)
        };

        expect(res.body).toMatchObject(expRes);
    });


    it("GET /clients - admin should be able to retrieve all users", async () => {
        const response = await req
            .get("/clients")
            .set("Authorization", `Bearer ${token.admin}`)
            .expect(200);

        expect(response.body).toHaveProperty("items");
        expect(response.body.items).toBeInstanceOf(Array);
    });
    
    it("GET /clients/:id - should retrieve one user", async () => {
        const res = await req
            .get(`/clients/1`)
            .set("Authorization", `Bearer ${token.admin}`)
            .expect(200);

        expect(res.body).toMatchObject(clients[0]);
    });

    it("GET /clients/:id - should not retrieve another user", async () => {
        const res = await req
            .get(`/clients/3`)
            .set("Authorization", `Bearer ${token.free}`)
            .expect(403);

        const expRes = {
            // success: false,
            message: "No estas autorizado a acceder a un recurso de otra persona a menos que tengas rol 'admin'",
            // errors: expect.any(Array)
        };

        expect(res.body).toMatchObject(expRes);
    });

    it("GET /clients/:id - should fail if the user not exists", async () => {
        await req
            .get("/clients/999")
            .set("Authorization", `Bearer ${token.admin}`)
            .expect(404);
    });
});

