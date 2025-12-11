import { db } from "../src/db";
import { productTable } from "../src/schemas/product.schema";
import { InferInsertModel } from "drizzle-orm";

export const products: InferInsertModel<typeof productTable>[] = [
    {
        name: "Laptop",
        description: "A high-performance laptop",
        price: 1200.50,
        stock: 50,
    },
    {
        name: "Mouse",
        description: "A wireless mouse",
        price: 25.00,
        stock: 200,
    },
    {
        name: "Keyboard",
        description: "A mechanical keyboard",
        price: 75.99,
        stock: 100,
    },
];

export const seedProducts = async () => {
    console.log("Seeding products...");
    await db.insert(productTable).values(products);
    console.log("products seeded successfully!");
};
