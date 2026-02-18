# FRAP Digital - Rescate Ensenada

Sistema de digitalización del formulario FRAP para el Cuerpo de Rescate de Ensenada, A.C.

## Deploy en Cloudflare Pages

### Opción 1: One-Click Deploy (Recomendado)

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/TU_USUARIO/frap-digital)

### Opción 2: Deploy Manual

1. **Fork este repositorio** a tu cuenta de GitHub

2. **Crear base de datos D1 en Cloudflare:**
   ```bash
   npx wrangler d1 create frap-database
   ```
   Copia el `database_id` que te genera.

3. **Configurar variables en Cloudflare Dashboard:**
   - Ve a tu proyecto en Cloudflare Pages
   - Settings > Environment Variables
   - Agrega:
     - `JWT_SECRET`: Una clave secreta segura
     - `D1_DATABASE_ID`: El ID de tu base de datos D1

4. **Conectar con Cloudflare Pages:**
   - Ve a Cloudflare Dashboard > Pages
   - Create a project > Connect to Git
   - Selecciona este repositorio
   - Configura:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Root directory: `/`

5. **Inicializar la base de datos:**
   ```bash
   npx wrangler d1 execute frap-database --file=./schema.sql
   ```

## Credenciales por Defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| operador1 | rescate1 | Operador |
| operador2 | rescate2 | Operador |
| operador3 | rescate3 | Operador |

## Características

- ✅ Formulario FRAP completo (2 páginas)
- ✅ Firma digital con canvas
- ✅ Exportación a PDF profesional con logo
- ✅ Sistema de folios automáticos (desde 1000)
- ✅ Validación de folios duplicados
- ✅ Control de acceso por roles
- ✅ Modo oscuro/claro
- ✅ 100% en español

## Estructura del Proyecto

```
/
├── src/                    # Frontend React
│   ├── components/         # Componentes UI
│   ├── pages/              # Páginas de la app
│   └── lib/                # Utilidades
├── functions/              # Cloudflare Pages Functions (API)
│   └── api/                # Endpoints de la API
├── public/                 # Assets estáticos
├── wrangler.toml           # Configuración de Cloudflare
└── schema.sql              # Esquema de base de datos
```

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Crear base de datos local
npx wrangler d1 execute frap-database --local --file=./schema.sql

# Iniciar servidor de desarrollo
npm run dev
```

## Licencia

MIT - Cuerpo de Rescate de Ensenada, A.C.
