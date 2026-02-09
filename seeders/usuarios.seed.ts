import { db } from "../src/db";
import { usuarios } from "../src/schemas/usuarios.schema";

const usuariosSeed = [
    {
        nombre: "Juan",
        apellido: "Perez",
        email: "juan.perez@mail.com",
        passwordHash: "hashed_password",
        activo: 1
    },
    {
        nombre: "Ana",
        apellido: "Lopez",
        email: "ana.lopez@mail.com",
        passwordHash: "hashed_password",
        activo: 1
    },
    {
        nombre: "Pedro",
        apellido: "Gomez",
        email: "pedro.gomez@mail.com",
        passwordHash: "hashed_password",
        activo: 0
    },
    {
        nombre: "Maria",
        apellido: "Fernandez",
        email: "maria.fernandez@mail.com",
        passwordHash: "hashed_password",
        activo: 1
    },
    {
        nombre: "Lucas",
        apellido: "Rossi",
        email: "lucas.rossi@mail.com",
        passwordHash: "hashed_password",
        activo: 1
    },
    {
        nombre: "Sofia",
        apellido: "Martinez",
        email: "sofia.martinez@mail.com",
        passwordHash: "hashed_password",
        activo: 1
    },
    {
        nombre: "Diego",
        apellido: "Alvarez",
        email: "diego.alvarez@mail.com",
        passwordHash: "hashed_password",
        activo: 0
    },
    {
        nombre: "Carla",
        apellido: "Suarez",
        email: "carla.suarez@mail.com",
        passwordHash: "hashed_password",
        activo: 1
    },
    {
        nombre: "Martin",
        apellido: "Silva",
        email: "martin.silva@mail.com",
        passwordHash: "hashed_password",
        activo: 1
    },
    {
        nombre: "Laura",
        apellido: "Mendez",
        email: "laura.mendez@mail.com",
        passwordHash: "hashed_password",
        activo: 1
    }
];

export async function seedUsuarios() {
    await db.insert(usuarios).values(usuariosSeed);
}
