import { Request, Response } from "express";
import { Forbidden, newPagination, NotFound } from "bradb";
import { eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { facturasService } from "../services/facturas.service";
import { facturasValidator } from "../validators/facturas.validator";
import { userRoles } from "@/schemas/usuarios.schema";
import { empresasServicioTable } from "../schemas/empresas_servicio.schema";

/** Lista facturas (filtro por estado, etc.). Usuario final solo ve las propias, con nombre de empresa. */
async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = facturasValidator.filter.parse(req.query);
    const baseFilters: Record<string, unknown> = { ...filters };
    if (res.locals.user.role === userRoles.finalUser) {
        (baseFilters as Record<string, unknown>).usuarioId = res.locals.user.id;
    }
    const items = await facturasService.findAll(baseFilters, pagination);

    const empresaIds = [...new Set(items.map((f) => f.empresaId))];
    const empresasRows =
        empresaIds.length > 0
            ? await db
                  .select()
                  .from(empresasServicioTable)
                  .where(inArray(empresasServicioTable.id, empresaIds))
            : [];
    const nombrePorId = new Map(empresasRows.map((e) => [e.id, e.nombre]));
    const categoriaPorId = new Map(empresasRows.map((e) => [e.id, e.categoria]));

    const enriched = items.map((row) => ({
        ...row,
        nombre: nombrePorId.get(row.empresaId) ?? null,
        descripcion: nombrePorId.get(row.empresaId) ?? null,
        categoriaEmpresa: categoriaPorId.get(row.empresaId) ?? null,
    }));

    res.json({
        pagination,
        items: enriched,
        total: pagination.total,
    });
}

async function getOne(req: Request, res: Response) {
    const pk = facturasValidator.pk.parse(req.params);
    const item = await facturasService.findOne(pk);
    if (!item) {
        throw new NotFound("Factura no encontrada");
    }
    if (res.locals.user.role === userRoles.finalUser) {
        if (Number(item.usuarioId) !== Number(res.locals.user.id)) {
            throw new Forbidden("No tenes permisos para ver esta factura");
        }
    }
    const [emp] = await db
        .select()
        .from(empresasServicioTable)
        .where(eq(empresasServicioTable.id, item.empresaId));
    res.json({
        ...item,
        nombre: emp?.nombre ?? null,
        descripcion: emp?.nombre ?? null,
        categoriaEmpresa: emp?.categoria ?? null,
    });
}

export const facturasController = {
    getAll,
    getOne,
};
