import { Request, Response } from "express";
import { newPagination } from "bradb";
import { and, eq, ne } from "drizzle-orm";
import { usuariosService } from "../services/usuarios.service"
import { usuariosValidator } from "../validators/usuarios.validator";
import { BadRequestError, NotFoundError } from "@/errors/http.error";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { usuariosTable } from "@/schemas/usuarios.schema";
import { monedaTypesKeys } from "@/schemas/cuentas.schema";
import { cuentasService } from "@/services/cuentas.service";
import { criptomonedasService } from "@/services/criptomonedas.service";
import { tipoCriptomonedaKeys } from "@/schemas/criptomonedas.schema";
import { accionesService } from "@/services/acciones.service";
import { tipoAccionKeys } from "@/schemas/acciones.schema";
import { userRoles } from "@/schemas/usuarios.schema";

/** Perfil del usuario autenticado (sin password). */
function stripPassword<T extends object>(item: T) {
    const { passwordHash: _p, ...safe } = item as Record<string, unknown>;
    return safe;
}

async function getMe(req: Request, res: Response) {
    const id = Number(res.locals.user.id);
    const item = await usuariosService.findOne({ id });
    if (!item) {
        throw new NotFoundError("Usuario no encontrado");
    }
    res.json(stripPassword(item));
}

/** Normaliza strings del body antes de validar (espacios, tipos). */
function normalizePatchMeBody(raw: unknown): Record<string, unknown> {
    if (!raw || typeof raw !== "object") {
        return {};
    }
    const o = raw as Record<string, unknown>;
    const out: Record<string, unknown> = { ...o };
    for (const key of ["nombre", "apellido", "email", "idioma", "password", "currentPassword"]) {
        const v = out[key];
        if (typeof v === "string") {
            out[key] = v.trim();
        }
    }
    return out;
}

/** Actualizar perfil del usuario autenticado (datos, preferencias, contraseña). */
async function patchMe(req: Request, res: Response) {
    const id = Number(res.locals.user.id);
    const body = usuariosValidator.patchMe.parse(normalizePatchMeBody(req.body));

    const existing = await usuariosService.findOne({ id });
    if (!existing) {
        throw new NotFoundError("Usuario no encontrado");
    }

    const row = existing as Record<string, unknown>;

    if (body.email != null && body.email !== row.email) {
        const dup = await db.query.usuariosTable.findFirst({
            where: and(
                eq(usuariosTable.email, body.email),
                ne(usuariosTable.id, id)
            ),
        });
        if (dup) {
            throw new BadRequestError("El email ya está en uso");
        }
    }

    const updates: Record<string, unknown> = {};

    if (body.nombre !== undefined) updates.nombre = body.nombre;
    if (body.apellido !== undefined) updates.apellido = body.apellido;
    if (body.email !== undefined) updates.email = body.email;
    if (body.genero !== undefined) updates.genero = body.genero;
    if (body.idioma !== undefined) updates.idioma = body.idioma;
    if (body.temaAplicacion !== undefined) updates.temaAplicacion = body.temaAplicacion;

    if (body.password != null) {
        const hash = String(row.passwordHash ?? "");
        const ok = await bcrypt.compare(body.currentPassword ?? "", hash);
        if (!ok) {
            throw new BadRequestError("La contraseña actual no es correcta");
        }
        updates.passwordHash = await bcrypt.hash(body.password, 10);
    }

    if (Object.keys(updates).length > 0) {
        await usuariosService.update({ id }, updates as Parameters<typeof usuariosService.update>[1]);
    }

    const item = await usuariosService.findOne({ id });
    res.json(stripPassword(item as object));
}

async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = usuariosValidator.filter.parse(req.query);
    const items = await usuariosService.findAll(filters, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total // this is going to be removed
    });
}

async function getOne(req: Request, res: Response) {
    const pk = usuariosValidator.pk.parse(req.params);
    const item = await usuariosService.findOne(pk);
    res.json(stripPassword(item as object));
}

async function create(req: Request, res: Response) {
    const data = usuariosValidator.insert.parse(req.body);
    const passwordHash = await bcrypt.hash(data.password, 10);
    db.transaction(async (tx) => {
        const item = await usuariosService.create({
            ...data,
            passwordHash
        }, tx);
        if (data.role === userRoles.admin) {
            res.status(201).json({ message: "Usuario registrado correctamente" });
            return;
        }
        for(const monedaType of monedaTypesKeys) {
            let alias = "";
            let cvu = "";
            for (let i = 0; true; i++) {
                alias = `${(item.nombre+item.apellido)}-${monedaType}-fc-${i}`;
                const aliasExists = await cuentasService.findAll({ alias: alias });
                if (aliasExists.length === 0) break;
            }
            for (let i = 0; true; i++) {
                cvu = Array.from({ length: 22 }, () => Math.floor(Math.random() * 10)).join("");
                const cvuExists = await cuentasService.findAll({ cvu: cvu });
                if (cvuExists.length === 0) break;
            }
            await cuentasService.create({
                alias: alias,
                cvu: cvu,
                usuarioId: item.id,
                saldo: "0.00",
                moneda: monedaType,
            }, tx);
        }
        for(const tipoCriptomoneda of tipoCriptomonedaKeys) {
            await criptomonedasService.create({
                usuarioId: item.id,
                tipoCriptomoneda: tipoCriptomoneda,
                monto: "0.00",
            }, tx);
        }
        for (const tipoAccion of tipoAccionKeys) {
            await accionesService.create(
                {
                    usuarioId: item.id,
                    tipoAccion,
                    monto: "0.00"
                },
                tx
            );
        }
        res.status(201).json({message: "Usuario creado correctamente"});
    });
    
}
async function update(req: Request, res: Response) {
    const pk = usuariosValidator.pk.parse(req.params);
    const data = usuariosValidator.update.parse(req.body);
    const item = await usuariosService.update(pk, data);
    res.status(200).json(stripPassword(item as object));
}

async function remove(req: Request, res: Response) {
    const pk = usuariosValidator.pk.parse(req.params);
    await usuariosService.delete(pk);
    res.status(204).send();
}

export const usuariosController = {
    getMe,
    patchMe,
    getAll,
    getOne,
    create,
    update,
    remove
};