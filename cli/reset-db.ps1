$ErrorActionPreference = "Stop"

# ============================
# CONFIGURACION POSTGRESQL
# ============================
$PG_BIN = "C:\Program Files\PostgreSQL\16\bin"

if (!(Test-Path "$PG_BIN\dropdb.exe")) {
    Write-Host "ERROR: No se encontro dropdb.exe en $PG_BIN"
    Write-Host "Verifica la version de PostgreSQL instalada."
    exit 1
}

# ============================
# CONFIRMACION
# ============================
$CONFIRM = Read-Host "ATENCION: Este script eliminara y recreara la base de datos. Escribi 'ACEPTAR' para continuar"
if ($CONFIRM -ne "ACEPTAR") {
    Write-Host "Operacion cancelada."
    exit 1
}

# ============================
# CARGAR VARIABLES DESDE .env
# ============================
if (!(Test-Path ".env")) {
    Write-Host "ERROR: No se encontro el archivo .env"
    exit 1
}

Get-Content .env |
    Where-Object { $_ -notmatch '^#' -and $_ -match 'DB_HOST|DB_PORT|DB_USER|DB_PASSWORD|DB_NAME' } |
    ForEach-Object {
        $parts = $_ -split '=', 2
        Set-Item -Path "Env:$($parts[0])" -Value $parts[1]
    }

# ============================
# ELIMINAR BASE DE DATOS
# ============================
Write-Host "Eliminando base de datos $Env:DB_NAME..."
$Env:PGPASSWORD = $Env:DB_PASSWORD

& "$PG_BIN\dropdb.exe" `
    -h $Env:DB_HOST `
    -p $Env:DB_PORT `
    -U $Env:DB_USER `
    --if-exists `
    $Env:DB_NAME

# ============================
# CREAR BASE DE DATOS
# ============================
Write-Host "Creando base de datos $Env:DB_NAME..."

& "$PG_BIN\createdb.exe" `
    -h $Env:DB_HOST `
    -p $Env:DB_PORT `
    -U $Env:DB_USER `
    $Env:DB_NAME

# ============================
# LIMPIAR DRIZZLE
# ============================
if (Test-Path "migrations\local") {
    Remove-Item -Recurse -Force migrations\local
}

New-Item -ItemType Directory -Force migrations\local\meta | Out-Null

# ============================
# CREAR _journal.json
# ============================
$json = '{ "version": "7", "dialect": "postgresql", "entries": [] }'
Set-Content -Path migrations\local\meta\_journal.json -Value $json -Encoding UTF8

# ============================
# DRIZZLE
# ============================
npx drizzle-kit generate --config drizzle.config.local.ts
npx drizzle-kit migrate --config drizzle.config.local.ts

Write-Host "Base de datos y Drizzle reseteados correctamente."

# ============================
# SEED
# ============================
npm run seed
