import { describe, expect, it } from "vitest";
import { req, token } from "./setup";
import { products } from "../seeders/products.seeder";

describe("Product Controller (Integration)", () => {
    it("GET /products - should retrieve all products", async () => {
        const response = await req
            .get("/products")
            .set("Authorization", `Bearer ${token.admin}`)
            .expect(200);

        expect(response.body).toHaveProperty("items");
        expect(response.body.items).toBeInstanceOf(Array);
    });

    it("GET /products/:id - should retrieve one product", async () => {
        const res = await req
            .get(`/products/1`)
            .set("Authorization", `Bearer ${token.admin}`)
            .expect(200);

        expect(res.body).toMatchObject(products[0]);
    });

    it("GET /products/:id - should fail if the product not exists", async () => {
        await req
            .get("/products/999")
            .set("Authorization", `Bearer ${token.admin}`)
            .expect(404);
    });

    it("POST /products - should create a new product", async () => {
        const newProduct = {
            name: "New Product",
            description: "A brand new product",
            price: 199.99,
            stock: 10,
        };

        const res = await req
            .post("/products")
            .set("Authorization", `Bearer ${token.admin}`)
            .send(newProduct)
            .expect(201);

        expect(res.body).toMatchObject(newProduct);
    });

    it("PUT /products/:id - should update a product", async () => {
        const updatedProduct = {
            name: "Updated Laptop",
            price: 1250.00,
        };

        const res = await req
            .put(`/products/1`)
            .set("Authorization", `Bearer ${token.admin}`)
            .send(updatedProduct)
            .expect(200);

        expect(res.body).toMatchObject(updatedProduct);
    });

    it("DELETE /products/:id - should delete a product", async () => {
        await req
            .delete(`/products/1`)
            .set("Authorization", `Bearer ${token.admin}`)
            .expect(204);
    });
});

