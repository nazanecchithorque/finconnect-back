import z from "zod";

export function strToNumber() {
    return z
        .union([z.string(), z.number()])
        .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
        .refine((val) => !isNaN(val), {
            message: "Must be a number or a numeric string"
        });
}

export function strToReal() {
    return z
        .union([z.string(), z.number()])
        .transform((val) => (typeof val === "string" ? parseFloat(val) : val));
}

export function strToNumberDefault(value: string) {
    return z
        .string()
        .default(value)
        .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
        .refine((val) => !isNaN(val), {
            message: "Must be a number or a numeric string"
        });
}

export function strToBoolean() {
    return z
        .union([z.string(), z.boolean()])
        .transform((val) =>
            typeof val === "string" ? (val == "false" ? false : true) : val
        )
        .refine((val) => typeof val !== "boolean" || typeof val !== "string", {
            message: "Must be a number or a numeric string"
        });
}

export function strToDate() {
    return z.union([z.string(), z.date()]).transform((val) => {
        if (val instanceof Date) {
            return val; // ya es Date
        }

        const parsed = new Date(val);
        if (isNaN(parsed.getTime())) {
            throw new Error("Invalid date string");
        }

        return parsed;
    });
}
