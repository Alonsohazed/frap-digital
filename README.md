# FRAP Digital - 

Sistema de digitalización del formulario FRAP

## Deploy en Cloudflare Pages


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

