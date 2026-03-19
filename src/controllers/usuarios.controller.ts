import { Request, Response } from "express";
import { newPagination } from "bradb";
import { usuariosService } from "../services/usuarios.service"
import { usuariosValidator } from "../validators/usuarios.validator";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { monedaTypesKeys } from "@/schemas/cuentas.schema";
import { cuentasService } from "@/services/cuentas.service";
import { criptomonedasService } from "@/services/criptomonedas.service";
import { tipoCriptomonedaKeys } from "@/schemas/criptomonedas.schema";
import { userRoles } from "@/schemas/usuarios.schema";

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
    res.json(item);
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
        res.status(201).json({message: "Usuario creado correctamente"});
    });
    
}
async function update(req: Request, res: Response) {
    const pk = usuariosValidator.pk.parse(req.params);
    const data = usuariosValidator.update.parse(req.body);
    const item = await usuariosService.update(pk, data);
    res.status(200).json(item);
}

async function remove(req: Request, res: Response) {
    const pk = usuariosValidator.pk.parse(req.params);
    await usuariosService.delete(pk);
    res.status(204).send();
}

export const usuariosController = {
    getAll,
    getOne,
    create,
    update,
    remove
};