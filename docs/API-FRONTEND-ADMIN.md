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
  "password": "contraseña123"
}
```

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

Los listados (`GET /usuarios`, `/cuentas`, `/movimientos`, etc.) soportan paginación por query params:

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
| role | string | `admin` o `final_user`. Si es `admin`, no se crean cuentas ni criptomonedas. |

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

- `[MONEDA]`: ARS, USD, EUR, BRL según la cuenta origen.
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
| GET | `/tarjetas` | Sí | Listar tarjetas del usuario |
| POST | `/tarjetas` | Sí | Crear tarjeta |
| POST | `/tarjetas/:id/bloquear` | Sí | Bloquear tarjeta (definitivo) |
| POST | `/tarjetas/:id/parar` | Sí | Pausar / reanudar tarjeta |
| POST | `/tarjetas/:id/cancelar` | Sí | Cancelar tarjeta |
| DELETE | `/tarjetas/:id` | Sí | Eliminar tarjeta (soft delete) |

---

## Healthcheck

**`GET /eso`** — Sin auth. Responde `"brad"` si el servidor está activo.

---

## Roles

- **admin**: Puede crear usuarios (`POST /usuarios`). No tiene cuentas ni criptomonedas.
- **final_user**: Usuario estándar con cuentas, criptomonedas y transacciones.

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

**Usuarios** y **Tarjetas** pueden tener lógica propia según el recurso.

---

## Modo mock

Para desarrollo sin consumir APIs externas (ej. CoinMarketCap):

```bash
npm run mock
```

Con `MOCK=true`, el endpoint `/criptomonedas/prices` devuelve datos simulados.
