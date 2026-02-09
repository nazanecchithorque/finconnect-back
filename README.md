# Proyecto Backend

Este documento proporciona una visión general de la estructura del proyecto backend, junto con pautas para desarrolladores sobre cómo extender la funcionalidad existente, como la creación de un nuevo CRUD para una entidad.

## Estructura del Proyecto

El proyecto sigue una arquitectura por capas, separando las responsabilidades en diferentes módulos para facilitar el mantenimiento y la escalabilidad.

- `index.ts`: Punto de entrada de la aplicación.
- `app.ts`: Archivo principal de la aplicación Express, donde se configuran las rutas y middlewares.
- `src/`: Contiene el código fuente de la aplicación.
    - `controllers/`: Reciben las peticiones HTTP y utilizan los servicios para procesarlas.
    - `services/`: Contienen la lógica de negocio y se comunican con la base de datos.
    - `routes/`: Definen las rutas de la API y las asocian con los controladores.
    - `schemas/`: Definen los esquemas de la base de datos utilizando Drizzle ORM.
    - `validators/`: Contienen los esquemas de validación de datos utilizando Zod.
    - `middlewares/`: Contienen los middlewares de Express, como autenticación y manejo de errores.
    - `filters/`: Contienen los filtros para las consultas a la base de datos.
    - `errors/`: Clases de error personalizadas.
    - `lib/`: Librerías y funciones de utilidad.
    - `db.ts`: Configuración de la conexión a la base de datos.
    - `env.ts`: Configuración de las variables de entorno.
- `seeders/`: Contiene los seeders para poblar la base de datos con datos de prueba.
- `tests/`: Contiene los tests de la aplicación.
- `migrations/`: Contiene las migraciones de la base de datos.

## Cómo crear un nuevo CRUD

A continuación, se detallan los pasos para crear un nuevo CRUD para una entidad, por ejemplo, `Vehicle`.

### 1. Crear el Esquema de la Base de Datos

Crea un archivo `src/schemas/vehicle.schema.ts` para definir el esquema de la tabla `vehicles` utilizando Drizzle ORM.

```ts
// src/schemas/vehicle.schema.ts
import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { timestamps } from "./util";

export const vehicleTable = pgTable("vehicles", {
    id: serial("id").primaryKey(),
    brand: varchar("brand", { length: 255 }).notNull(),
    model: varchar("model", { length: 255 }).notNull(),
    year: integer("year").notNull(),
    ...timestamps
});
```

### 2. Crear el Validador

Crea un archivo `src/validators/vehicle.validator.ts` para definir los esquemas de validación de datos utilizando Zod.

```ts
// src/validators/vehicle.validator.ts
import { z } from "zod";

export const vehicleSchema = z.object({
    id: z.number(),
    brand: z.string(),
    model: z.string(),
    year: z.number()
});

export const vehicleFilterSchema = vehicleSchema
    .pick({
        brand: true,
        model: true,
        year: true
    })
    .partial();

export const vehicleCreateSchema = vehicleSchema.pick({
    brand: true,
    model: true,
    year: true
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial();
```

### 3. Crear el Filtro

Crea un archivo `src/filters/vehicle.filter.ts` para definir los filtros para las consultas a la base de datos.

```ts
// src/filters/vehicle.filter.ts
import { FilterMap } from "bradb";
import { vehicleFilterSchema, vehicleTable } from "../schemas/vehicle.schema";
import { ilike, eq } from "drizzle-orm";

export const vehicleFilterMap: FilterMap<typeof vehicleFilterSchema> = {
    brand: (val) => ilike(vehicleTable.brand, `%${val}%`),
    model: (val) => ilike(vehicleTable.model, `%${val}%`),
    year: (val) => eq(vehicleTable.year, val)
};
```

### 4. Crear el Servicio

Crea un archivo `src/services/vehicle.service.ts` para definir la lógica de negocio y la comunicación con la base de datos.

```ts
// src/services/vehicle.service.ts
import { db } from "../db";
import { vehicleFilterMap } from "../filters/vehicle.filter";
import { ServiceBuilder } from "bradb";
import { vehicleTable } from "../schemas/vehicle.schema";

const builder = new ServiceBuilder(db, vehicleTable, vehicleFilterMap);

export const vehicleService = {
    create: builder.create(),
    update: builder.update(),
    count: builder.count(),
    delete: builder.softDelete(),
    findAll: builder.findAll(db.select().from(vehicleTable).$dynamic()),
    findOne: builder.findOne(db.select().from(vehicleTable).$dynamic())
};
```

### 5. Crear el Controlador

Crea un archivo `src/controllers/vehicle.controller.ts` para recibir las peticiones HTTP y utilizar el servicio para procesarlas.

```ts
// src/controllers/vehicle.controller.ts
import {
    createBuilder,
    deleteBuilder,
    findAllBuilder,
    findOneBuilder,
    updateBuilder
} from "bradb";
import { vehicleService } from "../services/vehicle.service";
import {
    vehicleCreateSchema,
    vehicleFilterSchema,
    vehicleUpdateSchema
} from "../validators/vehicle.validator";

export const vehicleController = {
    getById: findOneBuilder(vehicleService),
    getAll: findAllBuilder(vehicleService, vehicleFilterSchema),
    update: updateBuilder(vehicleService, vehicleUpdateSchema),
    create: createBuilder(vehicleService, vehicleCreateSchema),
    delete: deleteBuilder(vehicleService)
};
```

### 6. Crear las Rutas

Crea un archivo `src/routes/vehicle.routes.ts` para definir las rutas de la API y asociarlas con el controlador.

```ts
// src/routes/vehicle.routes.ts
import { Router } from "express";
import { vehicleController } from "../controllers/vehicle.controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/", auth, vehicleController.getAll);
router.get("/:id", auth, vehicleController.getById);
router.post("/", auth, vehicleController.create);
router.put("/:id", auth, vehicleController.update);
router.delete("/:id", auth, vehicleController.delete);

export default router;
```

### 7. Registrar las Rutas

En el archivo `app.ts`, importa y registra las nuevas rutas.

```ts
// app.ts
import express from "express";
import clientRoutes from "./src/routes/client.routes";
import productRoutes from "./src/routes/product.routes";
import vehicleRoutes from "./src/routes/vehicle.routes"; // Importa las nuevas rutas
import { customErrorHandler } from "./src/middlewares/errorHandler";
import { errorHandler } from "bradb";

export const app = express();

app.use(express.json());

app.use("/clients", clientRoutes);
app.use("/products", productRoutes);
app.use("/vehicles", vehicleRoutes); // Registra las nuevas rutas

// Importante ponerlo despues de todas las rutas, de otra forma no va a agarrar los errores
app.use(errorHandler);
app.use(customErrorHandler);
```

### 8. Actualizar los exports

Añade los exports de los nuevos archivos en los `index.ts` correspondientes.

- `src/schemas/index.ts`: `export * from "./vehicle.schema";`

### 9. Generar la Migración

Ejecuta el siguiente comando para generar la migración de la base de datos:

```bash
npm run db:generate
```

### 10. Correr las Migraciones

Ejecuta el siguiente comando para correr las migraciones de la base de datos:

```bash
npm run db:migrate
```

Con estos pasos, habrás creado un nuevo CRUD para la entidad `Vehicle` en el proyecto.
