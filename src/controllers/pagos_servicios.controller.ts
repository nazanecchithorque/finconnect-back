import { Request, Response } from "express";
import { Forbidden, newPagination, NotFound } from "bradb";
import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { pagosServiciosTable } from "../schemas/pagos_servicios.schema";
import { cuentasTable } from "../schemas/cuentas.schema";
import { facturasTable } from "../schemas/facturas.schema";
import { empresasServicioTable } from "../schemas/empresas_servicio.schema";
import { pagosServiciosService } from "../services/pagos_servicios.service";
import { pagosServiciosValidator } from "../validators/pagos_servicios.validator";
import { facturasService } from "../services/facturas.service";
import { cuentasService } from "../services/cuentas.service";
import { movimientosService } from "../services/movimientos.service";
import { empresasServicioService } from "../services/empresas_servicio.service";
import { estadoFactura } from "../schemas/facturas.schema";
import { sentidoMovimiento, tipoOperacion } from "../schemas/movimientos.schema";

const pagarFacturaValidator = pagosServiciosValidator.insert.pick({
    facturaId: true,
    cuentaId: true
});

/** Pagos de servicio del usuario (con empresa), más recientes primero. */
async function listMine(req: Request, res: Response) {
    const userId = Number(res.locals.user.id);
    const rows = await db
        .select({
            id: pagosServiciosTable.id,
            monto: pagosServiciosTable.monto,
            createdAt: pagosServiciosTable.createdAt,
            empresaNombre: empresasServicioTable.nombre,
            categoria: empresasServicioTable.categoria,
        })
        .from(pagosServiciosTable)
        .innerJoin(cuentasTable, eq(pagosServiciosTable.cuentaId, cuentasTable.id))
        .innerJoin(facturasTable, eq(pagosServiciosTable.facturaId, facturasTable.id))
        .innerJoin(
            empresasServicioTable,
            eq(facturasTable.empresaId, empresasServicioTable.id)
        )
        .where(eq(cuentasTable.usuarioId, userId))
        .orderBy(desc(pagosServiciosTable.createdAt))
        .limit(50);

    res.json({ items: rows });
}

async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = pagosServiciosValidator.filter.parse(req.query);
    const items = await pagosServiciosService.findAll(filters, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total
    });
}

async function getOne(req: Request, res: Response) {
    const pk = pagosServiciosValidator.pk.parse(req.params);
    const item = await pagosServiciosService.findOne(pk);
    res.json(item);
}

async function create(req: Request, res: Response) {
    const data = pagarFacturaValidator.parse(req.body);
    const usuario = res.locals.user;

    const factura = await facturasService.findOne({ id: data.facturaId });

    if (Number(factura.usuarioId) !== Number(usuario.id)) {
        throw new Forbidden("No tenes permisos para pagar esta factura");
    }

    if (factura.estado !== estadoFactura.pendiente) {
        throw new Forbidden("La factura no se puede pagar");
    }

    const cuenta = await cuentasService.findOne({ id: data.cuentaId });

    if (Number(cuenta.usuarioId) !== Number(usuario.id)) {
        throw new Forbidden("La cuenta no pertenece al usuario autenticado");
    }

    if (!cuenta.activo) {
        throw new Forbidden("La cuenta no esta activa");
    }

    if (Number(cuenta.saldo) < Number(factura.monto)) {
        throw new Forbidden("Saldo insuficiente");
    }

    const empresa = await empresasServicioService.findOne({ id: factura.empresaId });
    if (!empresa) {
        throw new NotFound("Empresa de servicio no encontrada");
    }

    const montoFactura = factura.monto;
    const saldoPosterior = (
        Number(cuenta.saldo) - Number(montoFactura)
    ).toString();

    const pago = await db.transaction(async (tx) => {
        await cuentasService.update(
            { id: cuenta.id },
            { saldo: saldoPosterior },
            tx
        );

        await movimientosService.create(
            {
                cuentaId: cuenta.id,
                tipoOperacion: tipoOperacion.pagoservicio,
                referenciaId: factura.id,
                sentido: sentidoMovimiento.egreso,
                monto: montoFactura,
                saldoPosterior,
                descripcion: `Pago ${empresa.nombre}`
            },
            tx
        );

        const nuevoPago = await pagosServiciosService.create(
            {
                facturaId: factura.id,
                cuentaId: cuenta.id,
                monto: montoFactura
            },
            tx
        );

        await facturasService.update(
            { id: factura.id },
            { estado: estadoFactura.pagada },
            tx
        );

        return nuevoPago;
    });

    res.status(201).json(pago);
}

async function update(req: Request, res: Response) {
    const pk = pagosServiciosValidator.pk.parse(req.params);
    const data = pagosServiciosValidator.update.parse(req.body);
    const item = await pagosServiciosService.update(pk, data);
    res.status(200).json(item);
}

async function remove(req: Request, res: Response) {
    const pk = pagosServiciosValidator.pk.parse(req.params);
    await pagosServiciosService.delete(pk);
    res.status(204).send();
}

export const pagosServiciosController = {
    listMine,
    getAll,
    getOne,
    create,
    update,
    remove
};
