# FRAP Digital - Sistema de Registro de Atención Prehospitalaria

## Problema Original
Sistema digital para el Cuerpo de Rescate de Ensenada, A.C. que permite crear, editar y generar PDFs de Formularios de Rescate y Atención Prehospitalaria (FRAP) idénticos al formato físico oficial.

## Arquitectura
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Cloudflare Pages Functions
- **Base de datos**: Cloudflare D1 (SQLite)
- **Generación PDF**: jsPDF + jspdf-autotable

## Usuarios del Sistema
1. **Administrador**: Acceso completo (crear, editar, eliminar, ver todos los FRAPs)
2. **Usuario**: Puede crear FRAPs, ver solo los propios

## Funcionalidades Implementadas

### ✅ Generación de PDF Idéntico al Formato Físico (Feb 2026)
- Layout de 2 columnas compacto como el formulario original
- Diagrama corporal (silueta humana) para marcar zonas de lesión
- Colores verde/azul para títulos de sección
- Todos los campos del formulario físico incluyendo:
  - Tiempos del servicio (horas)
  - Motivo de atención
  - Ubicación del servicio con número de ambulancia
  - Datos completos del paciente
  - Nivel de conciencia, vía aérea, ventilación
  - Circulación y presencia de pulsos
  - Exploración física con 15 tipos de hallazgos
  - Signos vitales (tabla de 3 registros)
  - Condición del paciente y prioridad (colores)
  - Control cervical y asistencia ventilatoria
  - Oxigenoterapia con LTS/MIN
  - Control de hemorragias
  - Vías venosas y tipo de soluciones
  - Accidente automovilístico detallado
  - Agente causal
  - Interrogatorio SAMPLE
  - Escalas: Glasgow, Cincinnati, Trauma
  - Datos de la madre (ginecobstétrico) con FUM
  - Datos post-parto y recién nacido
  - Firmas digitales
  - Consentimiento informado y negativa de atención

### ✅ Campos Añadidos al Formulario
- Número de ambulancia
- FUM (Fecha Última Menstruación)
- Asistencia ventilatoria (balón-válvula, ventilador automático)
- Control cervical (manual, rígido, blando)
- Vías venosas (IV #, catéter #, sitio aplicación)
- Tipo de soluciones (Hartmann, NaCl, Mixta, Glucosa, Otra)
- Lesiones causadas por
- Parabrisas roto/doblado
- Dentro del vehículo

## Backlog - Pendientes

### P0 (Crítico)
- [ ] Testear generación de PDF con datos reales
- [ ] Validar layout en diferentes navegadores

### P1 (Alta prioridad)
- [ ] Agregar marcador interactivo de zonas de lesión en el diagrama corporal
- [ ] Exportar PDF a formatos adicionales

### P2 (Media prioridad)
- [ ] Historial de versiones de FRAPs
- [ ] Estadísticas y reportes

## Estado Actual
- ✅ Build exitoso (Feb 2026)
- ✅ Todos los campos nuevos implementados
- ✅ PDF con layout de 2 columnas idéntico al formato físico
- ✅ Diagrama corporal incluido
- ✅ Lint sin errores

## Próximos Pasos
1. Desplegar a producción en Cloudflare Pages
2. Probar generación de PDF con datos reales
3. Validar con usuarios del Cuerpo de Rescate
4. Iterar basado en feedback
