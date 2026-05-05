import { Request, Response } from "express";
import { Forbidden, newPagination, NotFound } from "bradb";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
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
import { categoriaEmpresaServicio } from "../schemas/empresas_servicio.schema";

const pagarFacturaValidator = z
    .object({
        facturaId: z.coerce.number().int().positive().optional(),
        cuentaId: z.coerce.number().int().positive(),
        barcode: z
            .object({
                codigoEnte: z.string().trim().min(1).optional(),
                nombreEnte: z.string().trim().min(1).optional(),
                referencia: z.string().trim().min(1).optional(),
                monto: z.coerce.number().positive().optional()
            })
            .optional()
    })
    .refine((v) => v.facturaId !== undefined || v.barcode !== undefined, {
        message: "Debes enviar facturaId o barcode para pagar."
    });

function deducirCategoriaDesdeNombreOCodigo(
    nombre: string | undefined,
    codigo: string | undefined
) {
    const n = (nombre ?? "").toLowerCase();
    const c = (codigo ?? "").replace(/\D/g, "");
    if (n.includes("agua") || c === "5304") return categoriaEmpresaServicio.agua;
    if (n.includes("luz") || n.includes("energia") || n.includes("electric")) {
        return categoriaEmpresaServicio.luz;
    }
    if (n.includes("internet") || n.includes("fibra") || n.includes("wifi")) {
        return categoriaEmpresaServicio.internet;
    }
    if (n.includes("stream")) return categoriaEmpresaServicio.streaming;
    return categoriaEmpresaServicio.otros;
}

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
    const barcode = data.barcode;

    let factura;
    if (data.facturaId !== undefined) {
        factura = await facturasService.findOne({ id: data.facturaId });
    } else {
        if (!barcode) {
            throw new Forbidden("Faltan datos para pagar el servicio");
        }
        const codigo = (barcode.codigoEnte ?? "").replace(/\D/g, "").slice(0, 12);
        const nombre = (barcode.nombreEnte ?? "").trim() || "Servicio escaneado";
        const categoria = deducirCategoriaDesdeNombreOCodigo(nombre, codigo);
        const monto = barcode.monto;
        if (!Number.isFinite(monto) || Number(monto) <= 0) {
            throw new Forbidden("Monto inválido en el código escaneado");
        }

        let empresa: { id: number; nombre: string } | null = null;
        if (codigo.length > 0) {
            const [empresaRow] = await db
                .select({ id: empresasServicioTable.id, nombre: empresasServicioTable.nombre })
                .from(empresasServicioTable)
                .where(eq(empresasServicioTable.codigo, codigo));
            empresa = empresaRow ?? null;
        }
        if (!empresa) {
            const codigoNuevo =
                codigo.length > 0
                    ? codigo
                    : `9${String(Date.now()).slice(-11)}`;
            const creada = await empresasServicioService.create({
                codigo: codigoNuevo,
                nombre,
                categoria
            });
            empresa = { id: Number(creada.id), nombre: creada.nombre };
        }

        factura = await facturasService.create({
            usuarioId: Number(usuario.id),
            empresaId: empresa.id,
            monto: Number(monto).toFixed(2),
            vencimiento: new Date(Date.now() + 24 * 60 * 60 * 1000),
            estado: estadoFactura.pendiente
        });
    }

    if (!factura) {
        throw new NotFound("Factura no encontrada");
    }

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
