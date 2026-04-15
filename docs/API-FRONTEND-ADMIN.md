# API FinConnect - Guía para el Panel de Admin (Frontend)

Documentación de la API para integrar el panel de administración.

---

## Base URL

```
http://localhost:3000
```

(Reemplazar por la URL de producción cuando corresponda)

---

## Autenticación

Casi todos los endpoints requieren un **JWT** en el header:

```
Authorization: Bearer <token>
```

### Obtener token

**`POST /auth/login`**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta 200:**
```json
{
  "message": "Login exitoso",
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**`POST /auth/register`**

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@ejemplo.com",
  "dni": "12345678",
  "genero": "masculino",
  "password": "contraseña123",
  "numeroTramite": "12345678901"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| dni | string | 7 u 8 dígitos (se aceptan puntos; se guardan solo números) |
| numeroTramite | string (opcional) | Número de trámite del DNI (4–11 dígitos), recomendado para validación RENAPER |

Antes de crear el usuario se valida la identidad: con `MOCK=true` o sin API configurada se aplica validación local (formato DNI, datos coherentes). Con `RENAPER_API_URL` en `.env` se envía un `POST` al servicio configurado (JSON: `dni`, `nombre`, `apellido`, `genero`, `numeroTramite` opcional) y se espera `{ "valido": true }` o HTTP 2xx.

**Respuesta 201:**
```json
{
  "message": "Usuario registrado correctamente",
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Paginación

Los listados (`GET /usuarios`, `/cuentas`, `/movimientos`, `/transferencias`, `/criptomonedas`, `/cripto-transactions`, `/acciones`, `/accion-transactions`, `/pagos-servicios`, etc.) soportan paginación por query params:

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | number | 1 | Página actual |
| `pageSize` | number | 10 | Cantidad de items por página |

**Ejemplo:** `GET /usuarios?page=2&pageSize=20`

**Respuesta típica de listados:**
```json
{
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 50
  },
  "items": [...],
  "total": 50
}
```

---

## Formato de errores

### Errores HTTP (4xx, 5xx)

```json
{
  "success": false,
  "code": 400,
  "message": "Descripción del error"
}
```

### Errores de validación (Zod)

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["campo"],
      "message": "Mensaje de error",
      "code": "invalid_type"
    }
  ]
}
```

### Códigos comunes

| Código | Significado |
|--------|-------------|
| 400 | Bad Request / Validación fallida |
| 401 | No autenticado / Token inválido |
| 403 | Sin permiso para el recurso |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Endpoints por recurso

### Usuarios

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| GET | `/usuarios` | Sí | - | Listar usuarios (paginado) |
| GET | `/usuarios/:id` | Sí | - | Obtener un usuario |
| POST | `/usuarios` | Sí | admin | Crear usuario |
| PUT | `/usuarios/:id` | Sí | - | Actualizar usuario |
| DELETE | `/usuarios/:id` | Sí | - | Eliminar usuario |

**POST /usuarios** (solo admin):
```json
{
  "nombre": "María",
  "apellido": "García",
  "email": "maria@ejemplo.com",
  "dni": "87654321",
  "genero": "femenino",
  "password": "contraseña123",
  "role": "final_user"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| role | string | `admin` o `final_user`. Si es `admin`, no se crean cuentas, criptomonedas ni cajas de acciones. |

---

### Cuentas

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/cuentas` | Sí | Listar cuentas del usuario (paginado) |
| GET | `/cuentas/:id` | Sí | Obtener una cuenta |
| GET | `/cuentas/search?search=alias_o_cvu` | Sí | Buscar por alias o CVU |
| PUT | `/cuentas/:id` | Sí | Actualizar cuenta |
| DELETE | `/cuentas/:id` | Sí | Eliminar cuenta (soft delete) |

**Nota:** Si el token es de `final_user`, solo ve sus cuentas. Si es `admin`, ve todas.

---

### Movimientos

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/movimientos` | Sí | Listar movimientos (paginado). `final_user`: solo los suyos. `admin`: todos. |
| GET | `/movimientos/:id` | Sí | Obtener un movimiento |
| POST | `/movimientos` | Sí | Crear movimiento |
| PUT | `/movimientos/:id` | Sí | Actualizar movimiento |
| DELETE | `/movimientos/:id` | Sí | Eliminar movimiento |

---

### Transferencias

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/transferencias` | Sí | Listar transferencias (paginado). `final_user`: solo donde participa. `admin`: todas. |
| GET | `/transferencias/:id` | Sí | Obtener una transferencia |
| POST | `/transferencias` | Sí | Crear transferencia |

**POST /transferencias:**
```json
{
  "cuentaOrigenId": 1,
  "cuentaDestinoId": 2,
  "monto": "150.00"
}
```

**Reglas:** Ambas cuentas deben existir, estar activas, tener la misma moneda y la cuenta origen debe tener saldo ≥ monto.

**Sugerencia de UI para el formulario de transferencia:**

```
De cuenta en [MONEDA] con saldo *****  [👁]
A nombre destinatario: [alias o CVU del destino]

Monto
$[monto]

[Transferir]
```

- `[MONEDA]`: ARS, USD, EUR, JPY, BRL, GBP según la cuenta origen.
- `*****`: saldo enmascarado; el ícono de ojo (👁) alterna mostrar/ocultar.
- Destinatario: alias o CVU de la cuenta destino (del `GET /cuentas/search`).

---

### Criptomonedas

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/criptomonedas` | Sí | Listar cajas de cripto (paginado). `final_user`: solo las suyas. `admin`: todas. |
| GET | `/criptomonedas/prices?convert=ars` | Sí | Precios actuales de criptos |

**GET /criptomonedas/prices**

Query params:
- `convert` (opcional): `ars` | `eur` | `usd` | `jpy` | `brl` | `gbp` (default: `ars`)

**Respuesta 200:**
```json
[
  {
    "tipo": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "price": 98000000,
    "percentChange24h": -2.5,
    "lastUpdated": "2026-03-18T20:19:04.000Z"
  },
  ...
]
```

---

### Monedas (tipo de cambio fiat)

Vive en el mismo módulo que **`/currencies/convert`** (Frankfurter). El handler canónico es **`currenciesController.getMonedaPrices`**.

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/currencies/monedas-prices?convert=ars` | Sí | Cotización de EUR, USD, JPY, BRL y GBP |
| GET | `/monedas/prices?convert=ars` | Sí | Alias del endpoint anterior (misma respuesta) |

**GET /currencies/monedas-prices** (o **`GET /monedas/prices`**)

Query params:
- `convert` (opcional): `ars` \| `eur` \| `usd` \| `jpy` \| `brl` \| `gbp` (default: `ars`)

Cada ítem expresa **cuántas unidades de `convert` equivalen a 1 unidad** de la moneda listada (misma idea que el precio de las criptos en una divisa de referencia). Si `convert` coincide con una de las cinco monedas, esa entrada lleva `price: 1`.

**Respuesta 200:**
```json
[
  {
    "tipo": "eur",
    "symbol": "EUR",
    "name": "Euro",
    "price": 1200.5,
    "percentChange24h": null,
    "lastUpdated": "2026-04-15T12:00:00.000Z"
  },
  ...
]
```

Las cotizaciones provienen de la misma lógica que `/currencies/convert` (Frankfurter; mock si `MOCK=true`).

---

### Acciones

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/acciones` | Sí | Listar cajas de acciones (paginado). `final_user`: solo las suyas. `admin`: todas. |
| GET | `/acciones/prices?convert=ars` | Sí | Cotización de acciones (AAPL, MSFT, GOOGL, AMZN, NVDA) |

**GET /acciones**

Misma forma que `GET /criptomonedas`: filas por `usuarioId` + `tipoAccion` + `monto` (cantidad de títulos).

**GET /acciones/prices**

Query params:
- `convert` (opcional): `ars` \| `eur` \| `usd` \| `jpy` \| `brl` \| `gbp` (default: `ars`)

Los precios se cotizan en **USD** (Finnhub) y se convierten a `convert` con la misma lógica que `/currencies/convert`. Con `MOCK=true` se usan precios USD simulados y la conversión mock de Frankfurter.

**Respuesta 200:**
```json
[
  {
    "tipo": "apple",
    "symbol": "AAPL",
    "name": "Apple",
    "price": 250000,
    "percentChange24h": -0.4,
    "lastUpdated": "2026-04-15T12:00:00.000Z"
  },
  ...
]
```

| tipo | symbol | Empresa |
|------|--------|---------|
| `apple` | AAPL | Apple |
| `microsoft` | MSFT | Microsoft |
| `alphabet` | GOOGL | Alphabet |
| `amazon` | AMZN | Amazon |
| `nvidia` | NVDA | NVIDIA |

En entorno real (`MOCK=false`) hace falta `FINNHUB_API_KEY` en `.env`.

---

### Transacciones de acciones

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/accion-transactions` | Sí | Listar transacciones (paginado). `final_user`: solo las de sus cuentas. `admin`: todas. |
| GET | `/accion-transactions/:id` | Sí | Obtener una transacción |
| POST | `/accion-transactions` | Sí | Crear transacción (compra/venta de títulos) |
| PUT | `/accion-transactions/:id` | Sí | Actualizar transacción |
| DELETE | `/accion-transactions/:id` | Sí | Eliminar transacción |

**POST /accion-transactions:**
```json
{
  "cuentaId": 1,
  "tipoAccion": "apple",
  "sentido": "ingreso",
  "cantidad": "1.5"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| cuentaId | number | ID de la cuenta (moneda fiat) |
| tipoAccion | string | `apple`, `microsoft`, `alphabet`, `amazon`, `nvidia` |
| sentido | string | `ingreso` (vender títulos → recibir fiat) o `egreso` (comprar títulos → pagar fiat) |
| cantidad | string | Cantidad de acciones (ej. `"1"` o `"0.5"`) |

`precioUnitario` y `monto` se calculan en el backend con la cotización actual (Finnhub en USD convertida a la moneda de la cuenta, o mock).

---

### Transacciones de cripto

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/cripto-transactions` | Sí | Listar transacciones (paginado). `final_user`: solo las de sus cuentas. `admin`: todas. |
| GET | `/cripto-transactions/:id` | Sí | Obtener una transacción |
| POST | `/cripto-transactions` | Sí | Crear transacción (compra/venta) |
| PUT | `/cripto-transactions/:id` | Sí | Actualizar transacción |
| DELETE | `/cripto-transactions/:id` | Sí | Eliminar transacción |

**POST /cripto-transactions:**
```json
{
  "cuentaId": 1,
  "tipoCriptomoneda": "bitcoin",
  "sentido": "ingreso",
  "cantidad": "0.001"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| cuentaId | number | ID de la cuenta (moneda fiat) |
| tipoCriptomoneda | string | `bitcoin`, `ethereum`, `usdt`, `solana`, `cardano`, `polkadot`, `avalanche`, `binance`, `xrp`, `dogecoin` |
| sentido | string | `ingreso` (vender cripto → recibir fiat) o `egreso` (comprar cripto → pagar fiat) |
| cantidad | string | Cantidad de cripto (ej. `"0.001"`) |

`precioUnitario` y `monto` se calculan en el backend con el precio actual de la API.

---

### Tarjetas

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/tarjetas` | Sí | Listar tarjetas del usuario (de todas sus cuentas) |
| POST | `/tarjetas` | Sí | Crear tarjeta virtual |
| POST | `/tarjetas/:id/bloquear` | Sí | Bloquear tarjeta (definitivo → estado `cancelada`) |
| POST | `/tarjetas/:id/parar` | Sí | Pausar / reanudar tarjeta (alterna `activa` ↔ `bloqueada`) |
| POST | `/tarjetas/:id/cancelar` | Sí | Cancelar tarjeta (igual que bloquear) |
| DELETE | `/tarjetas/:id` | Sí | Eliminar tarjeta (soft delete) |

**POST /tarjetas:**
```json
{
  "cuentaId": 1
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| cuentaId | number | ID de la cuenta. Debe ser del usuario, activa y sin otra tarjeta activa. |

**Respuesta 201:**
```json
{
  "tarjeta": { "id": 1, "cuentaId": 1, "ultimos4": "1234", "marca": "mastercard", "estado": "activa", ... },
  "numeroCompleto": "5412345678901234",
  "numeroEnmascarado": "**** **** **** 1234"
}
```

**Estados:** `activa` | `bloqueada` | `cancelada`. Solo una tarjeta activa por cuenta.

---

### Servicios (pagos de facturas)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/pagos-servicios` | Sí | Listar pagos de servicios (paginado) |
| GET | `/pagos-servicios/:id` | Sí | Obtener un pago |
| POST | `/pagos-servicios` | Sí | Pagar una factura de servicio |
| PATCH | `/pagos-servicios/:id` | Sí | Actualizar pago |
| DELETE | `/pagos-servicios/:id` | Sí | Eliminar pago (soft delete) |

**POST /pagos-servicios** (pagar factura):
```json
{
  "facturaId": 1,
  "cuentaId": 2
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| facturaId | number | ID de la factura pendiente |
| cuentaId | number | ID de la cuenta desde la que se paga |

**Reglas:** La factura debe ser del usuario, estar en estado `pendiente`, la cuenta debe ser del usuario, activa y tener saldo ≥ monto de la factura. Al pagar, se debita la cuenta, se crea movimiento tipo `pagoservicio` y la factura pasa a `pagada`.

**Filtros en GET:** `facturaId`, `cuentaId`, `monto`, etc.

---

### Conversión de monedas (Frankfurter API)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/currencies/monedas-prices?convert=ars` | Sí | Listado fiat EUR/USD/JPY/BRL/GBP vs `convert` (ver sección *Monedas*) |
| GET | `/currencies/convert?from=USD&amount=100` | Sí | Convierte un monto de una moneda a todas las demás |

**Query params:**
- `from` (requerido): Código de moneda origen (USD, EUR, GBP, BRL, etc.)
- `amount` (opcional): Monto a convertir (default: 1)

**Respuesta 200:**
```json
{
  "amount": 100,
  "base": "USD",
  "date": "2026-03-19",
  "rates": {
    "EUR": 87.04,
    "GBP": 75.19,
    "BRL": 529.87,
    "ARS": 95000,
    ...
  }
}
```

---

### Conversión entre cuentas propias

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/currency-conversions` | Sí | Convertir moneda entre cuentas del mismo usuario |

**POST /currency-conversions:**
```json
{
  "cuentaOrigenId": 1,
  "cuentaDestinoId": 2,
  "montoOrigen": "100.00"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| cuentaOrigenId | number | ID de la cuenta desde la que se debita |
| cuentaDestinoId | number | ID de la cuenta a la que se acredita |
| montoOrigen | string | Monto en la moneda de la cuenta origen |

**Reglas:**
- Ambas cuentas deben ser del usuario autenticado.
- Ambas deben estar activas.
- Deben ser cuentas distintas y de **monedas diferentes** (para misma moneda usar `/transferencias`).
- La cuenta origen debe tener saldo ≥ montoOrigen.
- La tasa de cambio se obtiene de la API Frankfurter (o mock si `MOCK=true`).

**Respuesta 201:**
```json
{
  "message": "Conversión realizada correctamente",
  "montoOrigen": 100,
  "montoDestino": 87.04,
  "tasaCambio": 0.8704
}
```

Se crean movimientos tipo `conversion` en ambas cuentas.

---

## Healthcheck

**`GET /eso`** — Sin auth. Responde `"brad"` si el servidor está activo.

---

## Roles

- **admin**: Puede crear usuarios (`POST /usuarios`). No tiene cuentas, criptomonedas ni cajas de acciones.
- **final_user**: Usuario estándar con cuentas, criptomonedas, acciones y transacciones.

El token JWT incluye `id`, `email` y `role`. El backend usa `res.locals.user` para validar permisos.

---

## Filtrado por rol en listados

En los `GET` de listados, el filtro por usuario **solo se aplica si el token es de rol `final_user`**:

| Recurso | Admin | Final user |
|---------|-------|------------|
| Cuentas | Ve todas las cuentas | Solo sus cuentas |
| Movimientos | Ve todos los movimientos | Solo movimientos de sus cuentas |
| Transferencias | Ve todas las transferencias | Solo transferencias donde participa (origen o destino) |
| Criptomonedas | Ve todas las cajas | Solo sus cajas |
| Cripto-transactions | Ve todas las transacciones | Solo transacciones de sus cuentas |
| Acciones | Ve todas las cajas | Solo sus cajas |
| Accion-transactions | Ve todas las transacciones | Solo transacciones de sus cuentas |
| Tarjetas | N/A (admin sin cuentas) | Solo sus tarjetas (por sus cuentas) |
| Pagos-servicios | Lista todos los pagos | Lista todos (filtrar por factura/cuenta si aplica) |

**Usuarios** no se filtra por rol (admin puede listar todos).

---

## Modo mock

Para desarrollo sin consumir APIs externas (CoinMarketCap, Frankfurter):

```bash
npm run mock
```

Con `MOCK=true`:
- `/criptomonedas/prices` devuelve precios simulados.
- `/currencies/monedas-prices` (y el alias `/monedas/prices`) devuelve cotizaciones simuladas (EUR, USD, JPY, BRL, GBP).
- `/acciones/prices` devuelve cotizaciones simuladas (AAPL, MSFT, GOOGL, AMZN, NVDA).
- `/currencies/convert` devuelve tasas de cambio simuladas.
- `/currency-conversions` usa tasas mock para las conversiones.
