import { Request, Response } from "express";
import { Forbidden } from "bradb";
import { tarjetasService } from "@/services/tarjetas.service";
import { tarjetasValidator } from "../validators/tarjetas.validator"; 
import { cuentasService } from "../services/cuentas.service";
import { estadoTarjeta, marcaTarjeta } from "@/schemas/tarjetas.schema";

function isValidLuhn(pan: string): boolean {
    let sum = 0;
    let alt = false;
    for (let i = pan.length - 1; i >= 0; i--) {
        let n = parseInt(pan[i]!, 10);
        if (alt) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alt = !alt;
    }
    return sum % 10 === 0;
}

function randomDigit(): string {
    return String(Math.floor(Math.random() * 10));
}

/** PAN ficticio Mastercard 16 dígitos, válido por Luhn (solo desarrollo / demo). */
function generarPan16Mastercard(): string {
    const bins = ["51", "52", "53", "54", "55"] as const;
    const prefix = bins[Math.floor(Math.random() * bins.length)]!;
    let base = prefix;
    for (let i = 0; i < 13; i++) base += randomDigit();
    for (let d = 0; d <= 9; d++) {
        const candidate = base + String(d);
        if (isValidLuhn(candidate)) return candidate;
    }
    throw new Error("No se pudo generar el número de tarjeta");
}

async function create(req: Request, res: Response) {
    const data = tarjetasValidator.insert.parse(req.body);
    const usuario = res.locals.user;

    const cuenta = await cuentasService.findOne({ id: data.cuentaId });

    if (!cuenta.activo) {
        throw new Forbidden("Tu cuenta no está activa");
    }

    if (Number(cuenta.usuarioId) !== Number(usuario.id)) {
        throw new Forbidden(
            "No tenés permisos para crear tarjetas en esta cuenta"
        );
    }

    const tarjetasExistentes = await tarjetasService.findAll({
        cuentaId: cuenta.id
    });

    const tieneTarjetaActivaOPausada = tarjetasExistentes.some(
        (t) => t.estado !== estadoTarjeta.cancelada
    );

    if (tieneTarjetaActivaOPausada) {
        throw new Forbidden("La cuenta ya tiene una tarjeta activa");
    }

    const fechaEmision = new Date();
    const fechaVencimiento = new Date(fechaEmision);
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 5);

    const numeroCompleto = generarPan16Mastercard();
    const ultimos4 = numeroCompleto.slice(-4);

    const item = await tarjetasService.create({
        ...data,
        marca: marcaTarjeta.mastercard,
        ultimos4,
        tipo: "VIRTUAL",
        estado: estadoTarjeta.activa,
        fechaEmision,
        fechaVencimiento
    });

    res.status(201).json({
        tarjeta: item,
        numeroCompleto,
        numeroEnmascarado: `**** **** **** ${ultimos4}`
    });
}

async function getAllByUser(req: Request, res: Response) {
    const usuario = res.locals.user;

    const cuentas = await cuentasService.findAll({
        usuarioId: usuario.id
    });

    if (cuentas.length === 0) {
        res.json([]);
        return;
    }

    const tarjetasPorCuenta = await Promise.all(
        cuentas.map((cuenta) =>
            tarjetasService.findAll({
                cuentaId: cuenta.id
            })
        )
    );

    const items = tarjetasPorCuenta.flat();

    res.json(items);
}

async function parar(req: Request, res: Response) {
    const pk = tarjetasValidator.pk.parse(req.params);
    const usuario = res.locals.user;

    const tarjeta = await tarjetasService.findOne(pk);
    const cuenta = await cuentasService.findOne({ id: tarjeta.cuentaId });

    if (Number(cuenta.usuarioId) !== Number(usuario.id)) {
        throw new Forbidden(
            "No tenés permisos para modificar esta tarjeta"
        );
    }

    if (tarjeta.estado === estadoTarjeta.cancelada) {
        throw new Forbidden("No podés parar una tarjeta bloqueada definitivamente");
    }

    const nuevoEstado =
        tarjeta.estado === estadoTarjeta.bloqueada
            ? estadoTarjeta.activa
            : estadoTarjeta.bloqueada;

    const item = await tarjetasService.update(pk, { estado: nuevoEstado });

    res.json(item);
}

async function bloquear(req: Request, res: Response) {
    const pk = tarjetasValidator.pk.parse(req.params);
    const usuario = res.locals.user;

    const tarjeta = await tarjetasService.findOne(pk);
    const cuenta = await cuentasService.findOne({ id: tarjeta.cuentaId });

    if (Number(cuenta.usuarioId) !== Number(usuario.id)) {
        throw new Forbidden(
            "No tenés permisos para modificar esta tarjeta"
        );
    }

    if (tarjeta.estado === estadoTarjeta.cancelada) {
        res.json(tarjeta);
        return;
    }

    const item = await tarjetasService.update(pk, {
        estado: estadoTarjeta.cancelada,
        activo: false
    });

    res.json(item);
}

async function remove(req: Request, res: Response) {
    const pk = tarjetasValidator.pk.parse(req.params);
    const usuario = res.locals.user;

    const tarjeta = await tarjetasService.findOne(pk);
    const cuenta = await cuentasService.findOne({ id: tarjeta.cuentaId });

    if (Number(cuenta.usuarioId) !== Number(usuario.id)) {
        throw new Forbidden(
            "No tenés permisos para eliminar esta tarjeta"
        );
    }

    await tarjetasService.delete(pk);
    res.status(204).send();
}

export const tarjetasController = {
    create,
    getAllByUser,
    bloquear,
    parar,
    remove
};

